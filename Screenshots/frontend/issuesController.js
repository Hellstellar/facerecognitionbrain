(function(angular) {
  'use strict';

  // exports
  //@todo comment back in TO fields in reply and new message!
  angular
    .module('lapidus.issues')
    .controller('IssuesController', IssuesController);

  // inject dependencies
  IssuesController.$inject = ['AuthService', 'TreatmentService', '$q', '$filter', 'PATIENT_PARAMS', 'Treatment', 'ScheduledJobsService', 'lodash', 'patient', 'SETTINGS', '$scope', '$http', '$state', '$stateParams', 'Message', 'IssueCategories', 'MessagesHolder', 'paging', 'PagerHelper', '$modal', 'moment', 'PatientService'];

  function IssuesController(AuthService, TreatmentService, $q, $filter, PATIENT_PARAMS, Treatment, ScheduledJobsService, lodash, patient, SETTINGS, $scope, $http, $state, $stateParams, Message, IssueCategories, MessagesHolder, paging, PagerHelper, $modal, moment, PatientService) {
    var vm = this;
    // $state.reload()
    vm.changeStatus = changeStatus;
    vm.loading = true;
    vm.treatments = Treatment.$collection({ patient: $state.params.id });
    vm.treatments.$refresh();
    vm.updateValue = 0; //initial should be -1
    vm.dueToggle = false;
    vm.updateToggle = true; //initial should be false
    vm.toggleCreateIssue = toggleCreateIssue;
    vm.toggleSecondary = toggleSecondary;
    vm.createNewIssue = createNewIssue;
    vm.messagesView = 'topic';
    vm.pharma = SETTINGS.pharma;
    vm.issueItemView = vm.pharma ? 'scheduleCall' : 'generalContact';
    vm.updateIssueItemView = updateIssueItemView;
    vm.contact = {};
    vm.patientResponse = {};
    vm.support = SETTINGS.support;
    vm.patientResponse.receivedValue = vm.support.phone;
    vm.updateReceivedValue = updateReceivedValue;
    vm.postPatientResponse = postPatientResponse;
    vm.note = { channel: 'webapp' };
    vm.paging = $scope.paging = paging;
    vm.postResolution = postResolution;
    vm.postNonMetadataResolution = postNonMetadataResolution;
    vm.openResolutionModal = openResolutionModal;
    vm.openEscalationModal = openEscalationModal;
    vm.postEscalation = postEscalation;
    vm.postCantComplete = postCantComplete;
    vm.pauseIssue = pauseIssue;
    vm.unpauseIssue = unpauseIssue;
    vm.updateMessageTopic = updateMessageTopic;
    vm.toggleAutoSend = toggleAutoSend;
    vm.user = null;
    vm.replyBody = '';
    vm.replyOutcomeTags = [];
    vm.replyBodyDate = moment().format().substring(0,16);
    vm.displaySecondary = false;
    vm.displayReplyBox = false;
    vm.displayCreateBox = false;
    vm.changeStatusMsg = null;
    vm.submitReplyMsg = null;
    vm.topicMessage = {};
    vm.newIssue = {};
    vm.messages = [];
    vm.patientsMessages = [];
    vm.statuses= ['new', 'in progress'];
    vm.txtContacts = [];
    vm.updateTemplate = updateTemplate;
    vm.postContact = postContact;
    vm.postNote = postNote;
    vm.patientView = false;
    vm.noteChannels = PATIENT_PARAMS.noteChannels;
    vm.issueItems = PATIENT_PARAMS.issueItems;
    vm.userTypes = PATIENT_PARAMS.userTypes;
    vm.contactMethods = PATIENT_PARAMS.contactMethods;
    vm.pauseMeasure = 'days';
    vm.pauseLength;
    vm.receivedByUpdate = receivedByUpdate;
    vm.openDeleteIssueConfirm = openDeleteIssueConfirm;
    vm.clipBoardOnSuccess = clipBoardOnSuccess;
    vm.acknowledge = acknowledge;
    vm.textToCopy;
    vm.createRelatedIssue = createRelatedIssue;
    vm.needsAcknowledgement = false;
    vm.staticUrl = SETTINGS.staticUrl;
    vm.patientSaid = SETTINGS.patientSaid;
    vm.cneSaid = SETTINGS.cneSaid;
    vm.updateContent = updateContent;
    vm.reviewedContent = {};
    vm.resolution = {};
    vm.postCneResolution = postCneResolution;
    vm.clearCneResolution = clearCneResolution;
    vm.updateCallScheduleStatus = updateCallScheduleStatus;
    vm.downloadPvForm = downloadPvForm;
    vm.dataToCollect = "Collect the following information if possible: XERMELO start date, email, mobile phone number for texting, additional contact info (caregivers)"
    vm.sendWelcomeEmail = sendWelcomeEmail;
    vm.updateStartDate = updateStartDate;

    vm.scheduleCall = scheduleCall;
    vm.cneResolution = {
        contactCalled: '',
        callStatus: '',
        patientSaid: [],
        cneSaid: []
    };
    
    vm.emailTemplateArray = [];
    vm.templateLabel = {
      "Acknowledge" : 'We have received your question. Someone will reach out to you to discuss.',

      "{Oral Bundle} Pick up ready" : " We will have your Oral Bundle ready for you to pick up.",

      "Other Drug Pick up ready" : 'We will have it ready for you to pick up.',

      "More question" : 'What can we help you with?'
    }
    vm.newTemplates = [{
        issueType: "Refill/Prescription",
        replyLabel: ["{Oral Bundle} Pick up ready","Other Drug Pick up ready"]
      },{
        issueType: "Insurance",
        replyLabel: ["Acknowledge"]
      },{
        issueType: "Financial/Billing",
        replyLabel: ["Acknowledge", "More question"]
      },{
        issueType: "Symptom/Side Effect",
        replyLabel: ["Acknowledge"]
      },
      {
        issueType: "MD Question",
        replyLabel: ["Acknowledge"]
      },
      {
        issueType: "Appointment",
        replyLabel: ["Acknowledge"]
      },{
        issueType: "Miscellaneous",
        replyLabel: ["Acknowledge"]
      }]
    
    vm.callStatuses = [
        {   label: 'Canceled',
            value: 'canceled'
        },
        {   label: 'I need to follow up',
            value: 'followUp'
        },
        {
            label: 'I missed the call',
            value: 'cneMissed'
        },
        {
            label: 'Patient did not pick up',
            value: 'patientMissed'
        },
        {
            label: 'Left a voicemail',
            value: 'voicemail'
        }
    ];
    vm.resolutionCallStatuses = [
        {   label: 'Completed the Call',
            value: 'completed'
        },
        {
            label: "Can't Reach - Assume Decline",
            value: 'cant reach'
        }
    ];
    vm.staffCreateCategories = SETTINGS.staffCreateCategories;

    if(vm.pharma){
        vm.noteChannels = [
             {
                 label: 'Phone Log',
                 value: 'voice'
             },
             {
                 label: 'Note',
                 value: 'webapp'
             }
         ]
    }

    $http.get(SETTINGS.apiUrl+'/policy/global').then(function(data){
        vm.contactTemplates = data.data.contactTemplates;
    });

    function downloadPvForm(){
        var anchor = angular.element('<a/>');
        anchor.attr({
             href: 'images/DS-FRM-012a.pdf',
             target: '_blank',
             download: 'DS-FRM-012a.pdf',
        })[0].click();
    }

    function clearCneResolution(){
        vm.cneResolution.cneSaid = [];
        vm.cneResolution.patientSaid = [];
    }

    function postCneResolution(){
        var resolution = messageTemplate();
        resolution.resolves = {};
        resolution.resolves.issueId = vm.topicMessage._id;
        resolution.resolves.outcome = vm.cneResolution;
        resolution.body = 'resolved';
        resolution.metadata = {
              submittedBy: {
                  occurred: Date.now(),
                  type: 'user',
                  id: vm.user._id,
                  channel: 'webapp'
              }
        };

        if(vm.topicMessage.scheduledCalls.length === 0){
            vm.topicMessage.scheduledCalls = [{
                date: moment(),
                topic: 'PEC',
                status: vm.cneResolution.callStatus,
                scheduledBy: vm.user._id
            }]
        }
        vm.topicMessage.scheduledCalls.forEach(function(call){
            if(!call.status){
                call.status = vm.cneResolution.callStatus
            }
        })
        vm.topicMessage.currentScheduledCall = null;
        vm.topicMessage.status = 'resolved';
        updateMessage(vm.topicMessage);
        $http.post(SETTINGS.apiUrl + '/message/topics', resolution).then(function (res) {
          getPatientsMessages();
          list();
          vm.replyBody = '';
          vm.issueItemView = 'adhocResolution';
          vm.contact = {};
          MessagesHolder.put('Resolution posted!');
          getPatient();
        });

    }

    function applyPaging(params) {
      params.skip = PagerHelper.offsetFromPage(paging.page, paging.size);
      params.limit = paging.size;
      return params;
    }

    function sendWelcomeEmail(patientId, type){
      $http.post(SETTINGS.apiUrl + "/patient/welcome-email", {patient: patientId, type: type})
            .then(function(err, response){
                $state.go($state.current.name, {}, { reload: true});
            })
    }

    function clipBoardOnSuccess(e){
        e.clearSelection();
        MessagesHolder.put("Copied!");
    }

    function stripHtml(str){
        if(str){
            return str.replace(/<(?:.|\n)*?>/gm, '');
        }
    }

    function updateContent(treatment, contentId){
        var url = SETTINGS.apiUrl + '/bundle/' + treatment._id;
        var contentReviewed;
        treatment.contents.forEach(function(content){
            if(content._id === contentId){
                content.reviewed += 1;
                contentReviewed = content;
            }
        });
        $http.put(url, treatment).then(function(data){
            vm.treatments.$refresh();
            vm.reviewedContent[contentId] = true;
            var newMessage = messageTemplate();
            newMessage.body = 'Reviewed ' + contentReviewed.title + " for " + treatment.name;
            newMessage.issueItemType = 'note';
            newMessage.metadata = {
                  submittedBy: {
                      occurred: moment().format(),
                      type: 'user',
                      id: vm.user._id,
                      channel: 'webapp',
                      value: vm.user.firstName + ' ' + vm.user.lastName
                  },
                  receivedBy: {
                      channel: 'webapp'
                  }
            };
            $http.post(SETTINGS.apiUrl + '/message/topics', newMessage).then(function (res) {
              getPatientsMessages();
              list();
              MessagesHolder.put("Content Reviewed");
              vm.replyBody = '';
            });
        })
    }

    function scheduleCall(){
        vm.call.status = "";
        vm.call.topic = "PEC";
        vm.call.scheduledBy = vm.user._id;
        vm.topicMessage.scheduledCalls.push(vm.call);
        vm.topicMessage.currentScheduledCall = vm.call;
        vm.topicMessage.status = 'in progress';
        MessagesHolder.put("Call Scheduled");
        updateMessage(vm.topicMessage);
        vm.call ={};
    }

    function updateCallScheduleStatus(){
        vm.topicMessage.currentScheduledCall = null;
        updateMessage(vm.topicMessage)
    }

    function formatText(){
        var nonHtmlText = stripHtml(vm.topicMessage.body);
        if( vm.topicMessage.category === 'symptoms' ||  vm.topicMessage.category === 'symptomsUrgent'){
            vm.textToCopy = nonHtmlText
            if(vm.communicationHistory){
                vm.textToCopy += ("\n\n-------------------------- \n\n"
                + "Communication History \n\n"
                + vm.communicationHistory);

            }
            return
        }
        vm.textToCopy = ("Patient Message Received from WorkUp \n\n[ Category ]\n" + $filter('categoryLabel')(vm.topicMessage.category)
        + "\n\n[ Original Patient Message ]\n"
        + nonHtmlText + "\n\n"
        + "[ Received on ]\n"
        + moment(vm.topicMessage.date).format('lll') + " \n\n");
        if(vm.firstEscalation){
            if(vm.firstEscalation.acknowledgementDetails){
                vm.textToCopy += "[ Acknowledgement ] \n"
                + vm.firstEscalation.acknowledgementDetails.user.firstName
                +" " + vm.firstEscalation.acknowledgementDetails.user.lastName
                +", "+moment(vm.firstEscalation.acknowledgementDetails.date).format('lll')
            }
        }
        if(vm.communicationHistory){
            vm.textToCopy += ("\n\n-------------------------- \n\n"
            + "Communication History \n\n"
            + vm.communicationHistory);

        }
    }

    function acknowledge(){
        vm.topicMessage.status = 'in progress';
        var promises = [];
        $http.put(SETTINGS.apiUrl+'/message/'+vm.topicMessage._id, vm.topicMessage).then(function(){
          vm.patientsMessages.forEach(function(message, index){
              if(vm.topicMessage.topicId === message.topicId && message.issueItemType === 'escalation'){
                  if(!message.acknowledgementDetails){
                      message.acknowledgementDetails = {
                          user: vm.user,
                          date: new Date()
                      }
                      promises.push($http.put(SETTINGS.apiUrl+'/message/'+message._id, message))
                  }
              }
          });
          $q.all(promises).then(function(value){
            list(function(data){
              vm.needsAcknowledgement = false;
            });
          });
        })
    }

    function updateMessage(message){
        $http.put(SETTINGS.apiUrl+'/message/'+message._id, message).then(function (res) {
            list();
        });
    }

    function openResolutionModal(resolutionItem){
        vm.resolution = {};
        vm.resolutionItem = resolutionItem;
        var modalInstance = $modal.open({
            templateUrl: 'scripts/issues/views/issue-reply-items/adhoc-resolution.html',
            controller: 'issuesModalController',
            controllerAs: 'issuesCtrl',
            size: 'lg',
            resolve:{
                scope: function(){
                    return vm;
                }
            }
        });
        modalInstance.result.then(function(err){
            delete vm.resolutionItem;
            init();
        }).catch(function(){
            delete vm.resolutionItem;
            init();
        });
    }

    function getIngestrecord(){
        var params ={
            'patientId': vm.patient._id,
        }
        $http.get(SETTINGS.apiUrl+ '/ingestion-record', {params: params}).then(function(response){
            vm.records = response.data.data
        });
    }

    function openEscalationModal(escalationItem){
        vm.escalationItem = escalationItem;
        var modalInstance = $modal.open({
            templateUrl: 'scripts/issues/views/issue-reply-items/escalation.html',
            controller: 'issuesModalController',
            controllerAs: 'issuesCtrl',
            size: 'lg',
            resolve:{
                scope: function(){
                    return vm;
                }
            }
        });
        modalInstance.result.then(function(err){
            vm.escalation = {};
            delete vm.escalationItem;
            init();
        }).catch(function(){
            vm.escalation = {};
            delete vm.escalationItem;
            init();
        });
    }

    function updateReceivedValue(value){
      if(value ==='voice' || value === 'txt' ){
        vm.patientResponse.receivedValue = vm.support.phone;
      }else if(value === 'email'){
        vm.patientResponse.receivedValue = vm.support.email;
      }
      else{
        vm.patientResponse.receivedValue = '';
      }
    }

    function receivedByUpdate() {
      vm.patientResponse.receivedChannel = vm.patientResponse.submittedChannel;
      updateReceivedValue(vm.patientResponse.receivedChannel)
    }

    function updateTemplate(){
        if(vm.contactTemplate){
            vm.template = vm.contactTemplate.label;
            var url = SETTINGS.apiUrl+ '/template-source/parsed/'+ vm.contactTemplate +'?instance=default&lang=en-US'
            $http.get(url).then(function(data){
                vm.replyBody = data.data.replace('[CNE First Name]', vm.user.firstName)
                vm.replyBody = vm.replyBody.replace('[Patient First Name]', vm.patient.firstName)
                return;
            });
        }
        vm.replyBody = ""
      if(!vm.topicMessage.policyInfo.topicStateTemplates) { return; }
      if(vm.issueItemView === 'generalContact'){
          vm.template =  '';
          vm.replyBody = '';
          return;
      }
      vm.topicMessage.policyInfo.topicStateTemplates.forEach(function(template){
        if(template.name === vm.contact.channel){
          vm.template = template;
          vm.replyBody = vm.template.parsed;
        }
        if(vm.contact.channel === 'webapp' && (template.name ==='htmlEmail' || template.name ==='email')){
          vm.template = template;
          vm.replyBody = vm.template.parsed;
        }
        if(vm.contact.channel === 'voicemail' && (template.name ==='voice')){
          vm.template = template;
          vm.replyBody = vm.template.parsed;
        }
      });
    }

    function updateIssueItemView(view){
      vm.issueItemView = view;
      vm.template = null;
      vm.replyBody = '';
      vm.contact = {};
      vm.note = {};
      vm.note.channel = 'webapp';
      vm.patientResponse = {};
      vm.patientResponse.receivedValue = vm.support.phone;
      vm.replyBodyDate = moment().format().substring(0,16);
    }

    init();
    function init() {
      AuthService.me().then(function(user) {
        vm.isAdmin = AuthService.isAdmin(user);
        categories();
        getPatientsMessages();
        vm.user = user;
        vm.userTimezone = vm.user.timezone;
        var d = new Date()
        d.setMinutes(0)
        vm.call = {
            date: d
        };
        vm.origin = $state.params.origin;
        getPatient();
        list();
        if($state.current.name === 'patients.edit.issues'){
          $scope.$watch('paging.page', list);
        }else{
          list();
        }
      });
    }
    function getPatient(){
      vm.voiceContacts = [];
      vm.emailContacts = [];
      vm.webappContacts = [];
      vm.txtContacts = [];
      PatientService.getUser($stateParams.id).then(function(patient){
        vm.patient = patient.data.data[0];
        vm.patientTimezone = vm.patient.user.timezone;
        vm.patient.user.preferences.contacts.forEach(function(contact){
          contact.webapp = {};
          contact.webapp.name = contact.name;
          contact.webapp.relationship = contact.relationship;
          contact.webapp.id = contact._id;
          vm.webappContacts.push(contact.webapp);
          if(contact.txt && contact.txt.details){
            contact.txt.name = contact.name;
            contact.txt._id = contact._id;
            contact.txt.relationship = contact.relationship;
            vm.txtContacts.push(contact.txt);
          }
          if(contact.voice && contact.voice.details){
            contact.voice.name = contact.name;
            contact.voice._id = contact._id;
            contact.voice.relationship =  contact.relationship;
            vm.voiceContacts.push(contact.voice);
          }
          vm.phoneNumbers = lodash.union(vm.voiceContacts, vm.txtContacts);
          if(contact.email && contact.email.details){
            contact.email.name = contact.name;
            contact.email._id = contact._id;
            contact.email.relationship =  contact.relationship;
            vm.emailContacts.push(contact.email);
          }
          if(vm.txtContacts.length === 0){
              vm.contactMethods = vm.contactMethods.filter(function(method){
                  return method.label !== 'Text';
              });

          }
        });
        getIngestrecord();
        secondaryContactCheck();
      });
    }

    function updateStartDate(treatment){
      TreatmentService.update(treatment._id, treatment).then(function(data){
      })
    }

    function categories(){
      IssueCategories.getIssueCategories().then(function(res){
          vm.categories = res.data.data;
          vm.categories.forEach(function(category) {
            vm.emailTemplateArray.push({
              issueType: $filter('categoryLabel')(category),
              replyTemplate: []
            })
          })
          insertTemplate(vm.newTemplates);
      });
    }

    function insertTemplate(newTemplateArray) {
      
      newTemplateArray.forEach(function(issueTemplate) {
        var foundIssue; 
        vm.emailTemplateArray.some(function(issue) {
          if(issueTemplate.issueType === issue.issueType) {
            foundIssue = issue;
            return true;
          }
        });
        issueTemplate.replyLabel.forEach(function(label){
          var template = {
            label: label,
            message: vm.templateLabel[label]
          } 
          foundIssue.replyTemplate.push(template);
        })
      })
     }

    function list(cb) {
          var url = SETTINGS.apiUrl + '/message/topics';
          var params = {
            patient: $state.params.id,
            topicId: $state.params.topicId
          };
          if(!vm.isAdmin){
              params.category = SETTINGS.staffCategories;
          }
          if (vm.updateValue) {
            params['sort[updated]'] = vm.updateValue;
          }

          applyPaging(params);
          $http.get(url, {params: params}).then(function (res) {
            vm.messages = res.data.data;
            vm.total = res.data.total;
            if ($state.current.name === 'patients.edit.issues.detail') {
                vm.patientView = true;
                return detail(params, cb);
            }else if($state.current.name === 'issues.detail'){
                return detail(params);
            }
          });
    }

    function detail(params, cb) {
      var url = SETTINGS.apiUrl + '/message/topics/' + params.topicId;
      $http.get(url, {params: params}).then(function (res) {
        vm.topicMessage = res.data.data[0];
        if (vm.topicMessage.category === 'setup-refill-lb') {
            vm.resolution.outcome = {frequency: 'DAILY'};
        }


        if(vm.pharma){
            vm.resolution.itemId = vm.topicMessage._id
        }

        ScheduledJobsService.list({job_id_regex: vm.topicMessage.topicId}).then(function (jobs) {
            if (jobs.length > 0) {
                vm.topicMessage.hasAutoSend = jobs[0].hasAutoSend;
                vm.topicMessage.hasAutoSendEnabled = jobs[0].hasAutoSendEnabled;
            }
        });

        if(vm.topicMessage.topicState){
            if(vm.topicMessage.topicState.name === 'createItem'){
                if(vm.topicMessage.topicState.params.type === 'attemptedContact'){
                    vm.issueItemView = 'attemptedContact';
                }
                if(vm.topicMessage.topicState.params.type === 'escalation'){
                    vm.issueItemView = 'escalation';
                }
            }
        }

        vm.topicMessages = res.data.data;
        vm.topicMessages = vm.topicMessages.sort(function(a,b){
            return moment.utc(b.created).diff(moment.utc(a.created));
        });
        vm.resolvableIssues = [vm.topicMessage];
        var firstEscalationDate = moment();
        vm.communicationHistory = '';
        vm.topicMessages.forEach(function(msg){
            if(msg.issueItemType === 'patientResponse'
                || msg.issueItemType === 'generalContact'
                || msg.issueItemType === 'attemptedContact'){
                    var header = (msg.issueItemType === 'patientResponse' ?
                    'Patient sent by ' + msg.metadata.submittedBy.channel
                    : "Message sent by " + msg.metadata.receivedBy.channel +" to "+ msg.metadata.receivedBy.value)
                    +'\n';
                    vm.communicationHistory += ('Sent by ' + msg.metadata.submittedBy.value +'\n'
                    + header + stripHtml(msg.body) + '\n'+ moment(msg.created).format('lll') + '\n\n')
            }
            if(msg.issueItemType === 'escalation' && !msg.resolution){
                vm.resolvableIssues.push(msg);
                vm.escalationCount ++;
            }
            if(msg.issueItemType === 'escalation'){
                if(moment(msg.created) < firstEscalationDate){
                    vm.firstEscalation = msg;
                    firstEscalationDate = moment(msg.created);
                }
                if(!msg.acknowledgementDetails){
                    vm.needsAcknowledgement = true;
                }
            }

        });
        if(cb){
            return cb('cb called')
        }
        formatText()
        vm.loading = false;
      });
    }

    function getPatientsMessages() {
        $http.get(SETTINGS.apiUrl + '/message?patient=' + $state.params.id).then(function(msg) {
            countTopiclessMessages(msg.data.data);
            if (vm.patientsMessages.length === msg.data.data.length) {
            } else {
                vm.patientsMessages = msg.data.data;
            }
            vm.patientsMessages = vm.patientsMessages.filter(function(message){
                if(message.issueItemType !== 'topic' && message.issueItemType !== 'patientTopic'){
                    return message
                }
            })
        });
    }

    function postEscalation(){
        var newMessage = messageTemplate(),
        template,
        channelString = "";

        vm.topicMessage.policyInfo.escalationChannels[vm.topicMessage.topicState.params.level].forEach(function(channel){
            template = channel.templates[0];
            channel.configs.forEach(function(config){
                channelString += config.destination.to + ' ';
            });
            channelString += vm.patient.team.email;

        });
        newMessage.metadata = {
              submittedBy: {
                  occurred: Date.now(),
                  type: 'user',
                  id: vm.user._id,
                  channel: 'webapp',
              }
        };
        newMessage.issueItemChannelCategory = vm.topicMessage.topicState.params.category;
        newMessage.issueItemLevel = vm.topicMessage.topicState.params.level;
        newMessage.body = template.parsed + '<br> Issue has been escalated: ' + channelString,
        postIssueItem(newMessage);
    }

    function postNonMetadataResolution(){
console.log(vm.resolution.outcome)
        var newMessage = messageTemplate();
        if (vm.topicMessage.category === 'setup-refill-lb') {
            if (! vm.resolution.outcome.label) {
                vm.resolution.outcome.label = 'default';
            }
        }
        newMessage.resolves = {};
        newMessage.resolves.issueId = vm.topicMessage._id;
        newMessage.resolves.outcome = vm.resolution.outcome;
        newMessage.metadata = {
            submittedBy: {
                occurred: Date.now(),
                type: 'user',
                id: vm.user._id,
                channel: 'webapp'
            }
        };
        postIssueItem(newMessage);
    }

    function createRelatedIssue(message, category) {
        var url = SETTINGS.apiUrl + '/message/topics',
        newMessage = {
            category: category,
            patient: message.patient._id,
            type: 'issue',
            isTopic: true,
            from: message.patient.user,
            metadata: message.metadata,
            body: message.body,
            team: vm.patient.team._id,
            relatedTo: null
        };
        if(message.relatedTo.length > 0){
            newMessage.relatedTo = message.relatedTo;
            newMessage.relatedTo.push({
                topicId: message.topicId,
                relationship: 'blocks'
            })
        }else{
            newMessage.relatedTo = [
                {
                    topicId: message.topicId,
                    relationship: 'blocks'
                }
            ]
        }
          $http.post(url, newMessage).then(function(res){
              if(message.relatedTo.length > 0){
                  message.relatedTo.push({
                      topicId: res.data.data['topicId'],
                      relationship: 'spawnsTopic'
                  })
              }else{
                  message.relatedTo = [
                      {
                          topicId: res.data.data['topicId'],
                          relationship: 'spawnsTopic'
                      }
                  ]
              }
              updateMessage(message)
          });

    }

    function postCantComplete(){
        var newMessage = messageTemplate();
        newMessage.resolves = {
            issueId: vm.topicMessage._id,
        };
        newMessage.body = "cant resolve";
        newMessage.issueItemType = "note";
        newMessage.metadata = {
              submittedBy: {
                  occurred: Date.now(),
                  type: 'user',
                  id: vm.user._id,
                  channel: 'webapp'
              }
        };
        newMessage.resolves.outcome = vm.resolution;
        if(vm.cantCompleteOther){
            newMessage.resolves.outcome.cannotResolve.reason = vm.cantCompleteOther;
        }
        // newMessage.resolves.outcome = vm.resolution;
        postIssueItem(newMessage);
    }

    function postResolution(){
        var newMessage = messageTemplate();
        var data = {};
        if(vm.resolution.channel === 'ehr'){
            data.type = 'clinicStaff';
        }
        newMessage.resolves = {};
        if(vm.resolution.itemId === vm.topicMessage._id){
            newMessage.resolves.issueId = vm.resolution.itemId;
            if(vm.resolution.outcome){
                newMessage.resolves.outcome = vm.resolution.outcome;
            }
            else{
                newMessage.resolves.outcome = { value: vm.replyBody };
            }
        }else{
            newMessage.resolves.escalationId = vm.resolution.itemId;
            newMessage.resolves.outcome = { value: vm.replyBody };
        }
        newMessage.metadata = {
              submittedBy: {
                  occurred: moment(vm.replyBodyDate).format(),
                  type: data ? data.type : 'userContact',
                  id: data ? null : vm.resolution.details._id,
                  channel: vm.resolution.channel,
                  value: data ? vm.resolution.details : vm.resolution.details.details
              }
        };
        postIssueItem(newMessage);
    }


    function changeStatus() {
      if (vm.topicMessage.status !== 'cant complete') {
          var url = SETTINGS.apiUrl + '/message/topics/' + $stateParams['topicId'];
          $http.put(url, vm.topicMessage).then(function (res) {
              MessagesHolder.put('Status change saved');
          });
      }
    }


    function messageTemplate(){
        var newMessage = {
              type: vm.topicMessage.type,
              patient: vm.topicMessage.patient,
              isTopic: false,
              topicId: vm.topicMessage.topicId,
              category: vm.topicMessage.category,
              issueItemType: vm.issueItemView,
              body: vm.replyBody,
              outcomeTags: vm.replyOutcomeTags,
              from: vm.user._id,
              bundle: vm.topicMessage.bundle
        };
        return newMessage;
    }

    function countTopiclessMessages(messages){
        vm.topiclessMessageCount = 0;
        messages.forEach(function(message){
            if(!message.topicId && (message.category ==='issue' || message.category === '' || !message.category) && message.type !=='activated'){
                vm.topiclessMessageCount += 1;
            }
        });
    }

    function postNote(){
        var newMessage = messageTemplate();
        var data = null;
        if(vm.note.channel === 'ehr'){
            data = {};
            data.type = 'clinicStaff';
        }
        var date = moment(vm.replyBodyDate).format() ? moment(vm.replyBodyDate).format() : moment().format();
        newMessage.metadata = {
              submittedBy: {
                  occurred: date,
                  type: data ? data.type : 'user',
                  id: data ? null : vm.user._id,
                  channel: vm.note.channel,
                  value: data ? vm.note.by : vm.user.firstName + ' ' + vm.user.lastName
              }
        };
        postIssueItem(newMessage);
    }

    function postPatientResponse(){
      var value,
        submittedBy,
        newMessage = messageTemplate();
      if(vm.patientResponse.submittedBy){
        value = vm.patientResponse.submittedBy.name;
        submittedBy = vm.patientResponse.submittedBy._id;
      }
      if(!vm.patientResponse.submittedBy){
        value = {
          'name': vm.newContact.name,
          'relationship': vm.newContact.relationship,
        };
        submittedBy = null;
        value[vm.patientResponse.submittedChannel] = {};
        value[vm.patientResponse.submittedChannel]['details'] = vm.patientResponse.submittedValue;
      }

        newMessage.metadata = {
          submittedBy: {
              occurred: moment(vm.patientResponse.submittedDate).format(),
              type: 'userContact',
              id: submittedBy,
              channel: vm.patientResponse.submittedChannel,
              value: value
          },
          receivedBy: {
              occurred: moment(vm.patientResponse.receivedDate).format(),
              type: vm.patientResponse.receivedType.value,
              id: vm.patientResponse.receivedType.value === 'user' ?  vm.user._id : null,
              channel: vm.patientResponse.receivedChannel,
              value: vm.patientResponse.receivedValue,
              note: vm.patientResponse.receivedType.value !== 'user' ?
              vm.patientResponse.receivedBy : null
          }
      };
      postIssueItem(newMessage);
    }

    function postContact() {
        var newMessage = messageTemplate(),
            issueItemLevel,
            time = moment(vm.replyBodyDate).format();
        if(vm.topicMessage.topicState.params){
            issueItemLevel = vm.topicMessage.topicState.params.level;
        }
        newMessage.issueItemLevel = issueItemLevel;
        newMessage.metadata = {
            submittedBy: {
                occurred: time,
                type: 'user',
                id: vm.user._id,
                channel: 'webapp',
                value: vm.user.firstName + ' ' + vm.user.lastName
            },
            receivedBy: {
                occurred: time,
                type: 'userContact',
                id: vm.contact.details._id,
                channel: vm.contact.channel,
                value: vm.contact.details.details,
            }
        };
        if(!vm.isAdmin){
            acknowledge();
        }
        postIssueItem(newMessage);
    }

    function postIssueItem(message){
        $http.post(SETTINGS.apiUrl + '/message/topics', message).then(function (res) {
          getPatientsMessages();
          list();
          vm.replyBody = '';
          vm.issueItemView = 'generalContact';
          vm.contact = {};
          MessagesHolder.put('Reply posted!');
          getPatient();
        });
    }
    function createNewIssue() {
      var url = SETTINGS.apiUrl + '/message/topics',
          newMessage = {
            category: vm.newIssue.category,
            patient: vm.patient._id,
            type: 'issue',
            isTopic: true,
            from: vm.user._id,
            bundle: vm.newIssue.bundle,
            body: vm.newIssue.body ? vm.newIssue.body : vm.newIssue.category,
            team: vm.patient.team._id
          };
      if(!vm.isAdmin){
          newMessage.status = 'in progress';
      }
      $http.post(url, newMessage).then(function (res) {
          vm.displayCreateBox = false;
          vm.newIssue = {};
          MessagesHolder.put('Issue Created!');
          list();
      });
    }

    function pauseIssue() {
        // @TODO: Make pause length
        if (! vm.pauseLength || ! vm.pauseMeasure) return;

        var duration = 'P';
        if (vm.pauseMeasure === 'minutes') duration = duration + 'T' + vm.pauseLength + 'M';
        if (vm.pauseMeasure === 'hours') duration = duration + 'T' + vm.pauseLength + 'H';
        if (vm.pauseMeasure === 'days') duration = duration + vm.pauseLength + 'D';
        if (vm.pauseMeasure === 'weeks') duration = duration + vm.pauseLength + 'W';
        vm.topicMessage.topicState.pause = duration;
        vm.topicMessage.status = 'paused';
        $http.put(SETTINGS.apiUrl+'/message/'+vm.topicMessage._id, vm.topicMessage).then(function (res) {
            vm.topicMessage = res.data.data;
            MessagesHolder.put('Issue Paused');
        });
    }

    function unpauseIssue() {
        vm.topicMessage.status = 'unpaused';
        $http.put(SETTINGS.apiUrl+'/message/'+vm.topicMessage._id, vm.topicMessage).then(function (res) {
            vm.topicMessage = res.data.data;
            MessagesHolder.put('Issue Unpaused');
        });
    }

    function updateMessageTopic(message){
      message.metadata.submittedBy.occurred = message.date;
      message.metadata.submittedBy.value = message.from.name;
      message.topicId = vm.topicMessage.topicId;
      message.category = vm.topicMessage.category;
      message.issueItemType = 'patientResponse';
      message.status = 'enforceOnCreate';

      $http.put(SETTINGS.apiUrl+'/message/'+message._id, message).then(function (res) {
        getPatientsMessages();
        list();
      });
    }

    function toggleAutoSend(issue) {
        ScheduledJobsService.toggleAutoSendByTopicId(issue.topicId).then(function (res) {
            issue.hasAutoSendEnabled = ! issue.hasAutoSendEnabled;
            MessagesHolder.put("Scheduled Job Updated");
        });
    }

    function toggleCreateIssue(){
      if(vm.displayCreateBox === true){
        vm.displayCreateBox = false;
      }
      else{
        vm.displayCreateBox = true;
      }
    }

    function toggleSecondary() {
      vm.displaySecondary = !vm.displaySecondary;
    }

    function secondaryContactCheck() {
      var contactList = vm.patient.user.preferences.contacts;
      for (var x = 0; x < contactList.length; x++) {
        if (contactList[x].classification === "secondary") {
          vm.secondaryExist = true;
          break;
        }
      }
    }

    function deleteIssue(messageId) {
        if(messageId === false){
            return;
        }
      var url = SETTINGS.apiUrl + '/message/' + messageId;
      $http.delete(url).then(function (res) {
        MessagesHolder.put("Issue deleted");
        list();
      });
    }

    function openDeleteIssueConfirm(issueId) {
      var params = {
        templateUrl: 'scripts/issues/views/delete-issue.html',
        controller: 'DeleteIssueConfirmController',
        resolve: {
          issueId: function () {
            return issueId;
          }
        }
      };
      $modal.open(params).result.then(deleteIssue);
    }
}
})(angular);
