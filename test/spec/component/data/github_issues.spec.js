describeComponent('component/data/github_issues', function () {
  'use script';
  beforeEach(function () {
    this.setupComponent();
  });

  describe('createIssue', function() {
    var issues = {
      data: {
        projectName: "lala",
        issueTitle: "Best issue",
        issueBody: "iojfioadas"
      }
    };

    it('If it is able to create an issue on GitHub, trigger ui:add:issue', function(){
      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.success('');
      });
      var spyEvent = spyOnEvent(document, "ui:add:issue");

      this.component.trigger('ui:create:issue', issues);

      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });

    it('If it is not able to create issue on GitHub, show error', function(){
      var spy = spyOn($, 'ajax').and.callFake(function(e) {
        e.error('');
      });
      var errorEvent = spyOnEvent(document, "ui:show:messageFailConnection")

      this.component.trigger('ui:create:issue', issues);

      expect(errorEvent).toHaveBeenTriggeredOn(document);
    });
  });

  describe('prepareAllIssues', function() {
    var issue, issues, pullRequest;

    beforeEach(function () {
      pullRequest = {
        pull_request: true
      };
      issue = {
        url: 'https://api.github.com/repos/rodrigomaia17/try_git/issues/1'
      };

      issues = [pullRequest, issue];
    });

    it('should not add pull request issues', function() {
      expect(this.component.prepareAllIssues(issues, 'project1')).not.toContain(pullRequest);
    });

    it('should contain issue', function() {
      expect(this.component.prepareAllIssues(issues, 'project2')).toContain(issue);
    });

    it('should have the projectName attribute', function() {
      expect(this.component.prepareAllIssues(issues, 'project3')[0].projectName).toBe('project3');  
    });

    it('should call getRepoURLFromIssue', function() {
      expect(this.component.prepareAllIssues(issues, 'project3')[0].repoUrl).toBeTruthy();
    });
  });

  describe("addIssue", function () {
    it('trigger event data:issues:refreshed with the expected params', function () {
      var eventSpy = spyOnEvent(document, "data:issues:refreshed");
      this.component.trigger("ui:add:issue", {
        'issue': 'data'
      });

      expect(eventSpy).toHaveBeenTriggeredOn(document);
      expect(eventSpy.mostRecentCall.data).toEqual({
        'issues': {
          'issue': 'data'
        }
      });
    });
  });

  describe('getRepoURLFromIssue', function() {
    it('getRepoURLFromIssue should return repository url from all url types', function () {
      var issueUrls = [
        'https://api.github.com/repos/rodrigomaia17/try_git/issues/1',
        'https://api.github.com/repos/rodrigomaia17/try_git./issues/1',
        'https://api.github.com/repos/rodrigomaia17/try_git2/issues/1',
        'https://api.github.com/repos/rodrigomaia17/try_2git/issues/1',
        'https://api.github.com/repos/rodrigomaia17/try_git./issues/1',
        'https://api.github.com/repos/rodrigomaia17/try_git-./issues/1',
        'https://api.github.com/repos/rodrigomaia17/-123123--.try_git.-2--/issues/11',
        'https://api.github.com/repos/pixelated-project/pixelated-user-agent/issues/123',
        'https://api.github.com/repos/pixelated-project/pixelated-dispatcher/issues/412312',
        'https://api.github.com/repos/pixelated-project/project-issues/issues/123',
        'https://api.github.com/repos/pixelated-project/pixelated-platform/issues/14444',
        undefined
      ];

      var repositoryUrl = [
        'https://api.github.com/repos/rodrigomaia17/try_git/',
        'https://api.github.com/repos/rodrigomaia17/try_git./',
        'https://api.github.com/repos/rodrigomaia17/try_git2/',
        'https://api.github.com/repos/rodrigomaia17/try_2git/',
        'https://api.github.com/repos/rodrigomaia17/try_git./',
        'https://api.github.com/repos/rodrigomaia17/try_git-./',
        'https://api.github.com/repos/rodrigomaia17/-123123--.try_git.-2--/',
        'https://api.github.com/repos/pixelated-project/pixelated-user-agent/',
        'https://api.github.com/repos/pixelated-project/pixelated-dispatcher/',
        'https://api.github.com/repos/pixelated-project/project-issues/',
        'https://api.github.com/repos/pixelated-project/pixelated-platform/',
        undefined
      ];

      for (var i = 0; i < issueUrls.length; i++) {
        var expected = this.component.getRepoURLFromIssue(issueUrls[i]);
        expect(expected).toBe(repositoryUrl[i]);
      }
    });
  });

  describe('loadAndPrioritizeAllIssues', function() {
    var readRequest;

    it('should trigger blockUI event', function() {
      var spyEvent = spyOnEvent(document, 'ui:blockUI');
      this.component.loadAndPrioritizeAllIssues();
      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });

    it('should call fetchAllIssues once per repository', function() {
      this.component.attr.repositories = ['repotest1', 'repotest2'];
      spyOn(this.component, 'fetchAllIssues');
      this.component.loadAndPrioritizeAllIssues();
      expect(this.component.fetchAllIssues.calls.count()).toEqual(2);
    });

    it('update draggable issue should trigger event', function () {
      var spyEvent = spyOnEvent(document, 'data:issues:issueMoved');
      var event = {
        target: {
          id: '0 - Backlog'
        }
      };

      var ui = {
        item: [{}]
      };

      this.component.updateDraggable(event, ui);
      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });
  });

  describe('addIssuesToBoard', function(){
    var spyPrepareAllIssues;
    var sampleObject;

    beforeEach(function(){
      sampleObject = {name: 'Otavio'}
      spyPrepareAllIssues = spyOn(this.component, 'prepareAllIssues').and.returnValue([sampleObject]);
    });

    it('should call prepareAllIssues', function(){
      this.component.addIssuesToBoard({}, '');
      expect(spyPrepareAllIssues).toHaveBeenCalled();
    });

    it('shouldAdd sampleObject to issues', function(){
      this.component.addIssuesToBoard({}, '');
      expect(this.component.attr.issues).toContain(sampleObject);
    });

    it('should trigger data:issues:refreshed', function(){
      var spyEvent = spyOnEvent(document, 'data:issues:refreshed');
      this.component.addIssuesToBoard({}, '');
      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });

    it('should trigger ui:needs:priority', function(){
      var spyEvent = spyOnEvent(document, 'ui:needs:priority');
      this.component.addIssuesToBoard({}, '');
      expect(spyEvent).toHaveBeenTriggeredOn(document);
    });
  });

  describe('getIssueUrlFromElement', function() {
    it('should return expected URL', function() {
      var actualUrl = "http://github.com/lalala"
      var element = $('<div><div><a href="' + actualUrl + '"/></div></div>')[0];

      var resultUrl = this.component.getIssueUrlFromElement(element);
      expect(resultUrl).toBe('http://api.github.com/repos/lalala')
    })
  });

  describe('getAccessTokenParam', function () {
    it('should return access_token param and value', function() {
      spyOn(this.component, 'getCurrentAuthToken').and.returnValue('0201fc4dee77f5e0453b350549926f25de403904');

      var result = this.component.getAccessTokenParam();
      expect(result).toBe('?access_token=0201fc4dee77f5e0453b350549926f25de403904');
    });
  });

  it('DOM Object should be turned in a issue param', function () {
    var element = {
      id: 1,
      dataset: {
        priority: 1
      }
    };

    $(sandbox({
      id: 1,
      dataset: {
        priority: 1
      },
    })).append(sandbox());

    var result = this.component.DOMObjectToIssueMovedParam(element);

    expect(result).toEqual({
      id: 1,
      priority: 1
    });

  });

  it('DOM Object undefined should be turned in a issue param', function () {

    var result = this.component.DOMObjectToIssueMovedParam(undefined);

    expect(result).toEqual({
      id: 0,
      priority: 0
    });
  });
});