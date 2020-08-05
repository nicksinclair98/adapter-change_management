const request = require('request');

const validResponseRegex = /(2\d\d)/;


/**
 * The ServiceNowConnector class.
 *
 * @summary ServiceNow Change Request Connector
 * @description This class contains properties and methods to execute the
 *   ServiceNow Change Request product's APIs.
 */
class ServiceNowConnector {

  /**
   * @memberof ServiceNowConnector
   * @constructs
   * @description Copies the options parameter to a public property for use
   *   by class methods.
   *
   * @param {object} options - API instance options.
   * @param {string} options.url - Your ServiceNow Developer instance's URL.
   * @param {string} options.username - Username to your ServiceNow instance.
   * @param {string} options.password - Your ServiceNow user's password.
   * @param {string} options.serviceNowTable - The table target of the ServiceNow table API.
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @callback iapCallback
   * @description A [callback function]{@link
   *   https://developer.mozilla.org/en-US/docs/Glossary/Callback_function}
   *   is a function passed into another function as an argument, which is
   *   then invoked inside the outer function to complete some kind of
   *   routine or action.
   *
   * @param {*} responseData - When no errors are caught, return data as a
   *   single argument to callback function.
   * @param {error} [errorMessage] - If an error is caught, return error
   *   message in optional second argument to callback function.
   */

  /**
   * @memberof ServiceNowConnector
   * @method constructUri
   * @description Build and return the proper URI by appending an optionally passed
   *   [URL query string]{@link https://en.wikipedia.org/wiki/Query_string}.
   *
   * @param {string} serviceNowTable - The table target of the ServiceNow table API.
   * @param {string} [query] - Optional URL query string.
   *
   * @return {string} ServiceNow URL
   */
  constructUri(query = null) {
    let uri = `/api/now/table/${this.options.serviceNowTable}`;
    if (query) {
        uri = uri + '?' + query;
    }
    log.debug(`URI: ${uri}`)
    return uri;
    
  }

  /**
   * @memberof ServiceNowConnector
   * @method isHibernating
   * @description Checks if request function responded with evidence of
   *   a hibernating ServiceNow instance.
   *
   * @param {object} response - The response argument passed by the request function in its callback.
   *
   * @return {boolean} Returns true if instance is hibernating. Otherwise returns false.
   */
  isHibernating(response) {
    return response.body.includes('Instance Hibernating page')
    && response.body.includes('<html>')
    && response.statusCode === 200;
  }

  /**
   * @memberof ServiceNowConnector
   * @method processRequestResults
   * @description Inspect ServiceNow API response for an error, bad response code, or
   *   a hibernating instance. If any of those conditions are detected, return an error.
   *   Else return the API's response.
   *
   * @param {error} error - The error argument passed by the request function in its callback.
   * @param {object} response - The response argument passed by the request function in its callback.
   * @param {string} body - The HTML body argument passed by the request function in its callback.
   * @param {iapCallback} callback - Callback a function.
   * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
   *   Will be HTML text if hibernating instance.
   * @param {error} callback.error - The error property of callback.
   */
  processRequestResults(error, response, body, callback) {
    let callbackData = null;
    let callbackError = null;
    
    if (error) {
        log.error('Error present.');
        callbackError = error;
    } else if (this.isHibernating(response)) {
        callbackError = "Hibernating instance";
        log.error(callbackError);
    } else if (!validResponseRegex.test(response.statusCode)) {
        log.error('Bad response code.');
        callbackError = response;
    } else {
        if (response.body) {
            const jsonBody = JSON.parse(response.body);
            const results = jsonBody.result;

            results.forEach(result => {
                result.change_ticket_number = result.number;
                result.change_ticket_key = result.sys_id;
                
                delete result.number;
                delete result.sys_id;
                delete result.parent;
                delete result.reason;
                delete result.watch_list;
                delete result.upon_reject;
                delete result.sys_updated_on;
                delete result.type;
                delete result.approval_history;
                delete result.test_plan;
                delete result.cab_delegate;
                delete result.requested_by_date;
                delete result.state;
                delete result.sys_created_by;
                delete result.knowledge;
                delete result.order;
                delete result.phase;
                delete result.cmdb_ci;
                delete result.delivery_plan;
                delete result.contract;
                delete result.impact;
                delete result.work_notes_list;
                delete result.sys_domain_path;
                delete result.cab_recommendation;
                delete result.production_system;
                delete result.review_date;
                delete result.business_duration;
                delete result.group_list;
                delete result.requested_by;
                delete result.change_plan;
                delete result.approval_set;
                delete result.implementation_plan;
                delete result.approval_history;
                delete result.test_plan;
                delete result.correlation_display;
                delete result.delivery_task;
                delete result.additional_assignee_list;
                delete result.outside_maintenance_schedule;
                delete result.end_date;
                delete result.short_description;
                delete result.std_change_producer_version;
                delete result.service_offering;
                delete result.sys_class_name;
                delete result.closed_by;
                delete result.follow_up;
                delete result.reassignment_count;
                delete result.review_status;
                delete result.assigned_to;
                delete result.start_date;
                delete result.sla_due;
                delete result.comments_and_work_notes;
                delete result.escalation;
                delete result.upon_approval;
                delete result.correlation_id;
                delete result.made_sla;
                delete result.backout_plan;
                delete result.conflict_status;
                delete result.sys_updated_by;
                delete result.opened_by;
                delete result.user_input;
                delete result.sys_created_on;
                delete result.on_hold_task;
                delete result.sys_domain;
                delete result.closed_at;
                delete result.review_comments;
                delete result.business_service;
                delete result.time_worked;
                delete result.expected_start;
                delete result.opened_at;
                delete result.phase_state;
                delete result.cab_date;
                delete result.work_notes;
                delete result.close_code;
                delete result.assignment_group;
                delete result.on_hold_reason;
                delete result.calendar_duration;
                delete result.close_notes;
                delete result.contact_type;
                delete result.cab_required;
                delete result.urgency;
                delete result.scope;
                delete result.company;
                delete result.justification;
                delete result.activity_due;
                delete result.comments;
                delete result.approval;
                delete result.due_date;
                delete result.sys_mod_count;
                delete result.on_hold;
                delete result.sys_tags;
                delete result.conflict_last_run;
                delete result.unauthorized;
                delete result.location;
                delete result.risk;
                delete result.category;
                delete result.risk_impact_analysis;
            });

            callbackData = results;
        }
    }
    
    return callback(callbackData, callbackError);
  }

  /**
   * @memberof ServiceNowConnector
   * @method sendRequest
   * @description Builds final options argument for request function
   *   from global const options and parameter callOptions.
   *   Executes request call, then verifies response.
   *
   * @param {object} callOptions - Passed call options.
   * @param {string} callOptions.query - URL query string.
   * @param {string} callOptions.serviceNowTable - The table target of the ServiceNow table API.
   * @param {string} callOptions.method - HTTP API request method.
   * @param {iapCallback} callback - Callback a function.
   * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
   *   Will be HTML text if hibernating instance.
   * @param {error} callback.error - The error property of callback.
   */
  sendRequest(callOptions, callback) {
    // Initialize return arguments for callback
    let uri;
    if (callOptions.query)
      uri = this.constructUri(callOptions.query);
    else
      uri = this.constructUri();
    
    const requestOptions = {
      method: callOptions.method,
      auth: {
        user: this.options.username,
        pass: this.options.password,
      },
      baseUrl: this.options.url,
      uri: uri,
    };
    
    request(requestOptions, (error, response, body) => {
      this.processRequestResults(error, response, body, (processedResults, processedError) => callback(processedResults, processedError));
    });
  }

  /**
   * @memberof ServiceNowConnector
   * @method post
   * @description Call the ServiceNow POST API. Sets the API call's method,
   *   then calls sendRequest().
   *
   * @param {object} callOptions - Passed call options.
   * @param {string} callOptions.serviceNowTable - The table target of the ServiceNow table API.
   * @param {iapCallback} callback - Callback a function.
   * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
   *   Will be HTML text if hibernating instance.
   * @param {error} callback.error - The error property of callback.
   */
  post(callback) {
    let getCallOptions = { ...this.options };
    getCallOptions.method = 'POST';
    this.sendRequest(getCallOptions, (results, error) => callback(results, error));
  }

  /**
   * @memberof ServiceNowConnector
   * @method get
   * @summary Calls ServiceNow GET API
   * @description Call the ServiceNow GET API. Sets the API call's method and query,
   *   then calls this.sendRequest(). In a production environment, this method
   *   should have a parameter for passing limit, sort, and filter options.
   *   We are ignoring that for this course and hardcoding a limit of one.
   *
   * @param {iapCallback} callback - Callback a function.
   * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
   *   Will be HTML text if hibernating instance.
   * @param {error} callback.error - The error property of callback.
   */
  get(callback) {
    let getCallOptions = { ...this.options };
    getCallOptions.method = 'GET';
    //getCallOptions.query = 'sysparm_limit=1';
    this.sendRequest(getCallOptions, (results, error) => callback(results, error));
  }

}

module.exports = ServiceNowConnector;