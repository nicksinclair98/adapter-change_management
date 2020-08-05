// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;

/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 *   brokers and products can execute. This class inherits the EventEmitter
 *   class.
 */
class ServiceNowAdapter extends EventEmitter {

  /**
   * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
   *   data-first convention.
   * @callback ServiceNowAdapter~requestCallback
   * @param {(object|string)} responseData - The entire REST API response.
   * @param {error} [errorMessage] - An error thrown by REST API call.
   */

  /**
   * Here we document the adapter properties.
   * @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
   *   instance's properties object.
   * @property {string} url - ServiceNow instance URL.
   * @property {object} auth - ServiceNow instance credentials.
   * @property {string} auth.username - Login username.
   * @property {string} auth.password - Login password.
   * @property {string} serviceNowTable - The change request table name.
   */

  /**
   * @memberof ServiceNowAdapter
   * @constructs
   *
   * @description Instantiates a new instance of the Itential ServiceNow Adapter.
   * @param {string} id - Adapter instance's ID.
   * @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
   */
  constructor(id, adapterProperties) {
    // Call super or parent class' constructor.
    super();
    // Copy arguments' values to object properties.
    this.id = id;
    this.props = adapterProperties;
    // Instantiate an object from the connector.js module and assign it to an object property.
    this.connector = new ServiceNowConnector({
      url: this.props.url,
      username: this.props.auth.username,
      password: this.props.auth.password,
      serviceNowTable: this.props.serviceNowTable
    });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method connect
   * @summary Connect to ServiceNow
   * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
   *   IAP calls this method after instantiating an object from the class.
   *   There is no need for parameters because all connection details
   *   were passed to the object's constructor and assigned to object property this.props.
   */
  connect() {
    // As a best practice, Itential recommends isolating the health check action
    // in its own method.
    this.healthcheck();
  }

  /**
   * @memberof ServiceNowAdapter
   * @method healthcheck
   * @summary Check ServiceNow Health
   * @description Verifies external system is available and healthy.
   *   Calls method emitOnline if external system is available.
   *
   * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
   *   that handles the response.
   */
  healthcheck(callback) {
    this.getRecord((result, error) => {
      /**
        * For this lab, complete the if else conditional
        * statements that check if an error exists
        * or the instance was hibernating. You must write
        * the blocks for each branch.
        */
      if (error) {
        /**
          * Write this block.
          * If an error was returned, we need to emit OFFLINE.
          * Log the returned error using IAP's global log object
          * at an error severity. In the log message, record
          * this.id so an administrator will know which ServiceNow
          * adapter instance wrote the log message in case more
          * than one instance is configured.
          * If an optional IAP callback function was passed to
          * healthcheck(), execute it passing the error seen as an argument
          * for the callback's errorMessage parameter.
          */
        log.error(`\nError with external system with ID:\n${this.id}`)
        this.emitOffline();

        if (callback) {
          callback(result, error);
        }
      } else {
        /**
          * Write this block.
          * If no runtime problems were detected, emit ONLINE.
          * Log an appropriate message using IAP's global log object
          * at a debug severity.
          * If an optional IAP callback function was passed to
          * healthcheck(), execute it passing this function's result
          * parameter as an argument for the callback function's
          * responseData parameter.
          */
        log.debug("\nExternal system is available and healthy!");
        this.emitOnline();

        if (callback) {
          callback(result, error);
        }
      }
    });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOffline
   * @summary Emit OFFLINE
   * @description Emits an OFFLINE event to IAP indicating the external
   *   system is not available.
   */
  emitOffline() {
    this.emitStatus('OFFLINE');
    log.warn('ServiceNow: Instance is unavailable.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOnline
   * @summary Emit ONLINE
   * @description Emits an ONLINE event to IAP indicating external
   *   system is available.
   */
  emitOnline() {
    this.emitStatus('ONLINE');
    log.info('ServiceNow: Instance is available.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitStatus
   * @summary Emit an Event
   * @description Calls inherited emit method. IAP requires the event
   *   and an object identifying the adapter instance.
   *
   * @param {string} status - The event to emit.
   */
  emitStatus(status) {
    this.emit(status, { id: this.id });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method getRecord
   * @summary Get ServiceNow Record
   * @description Retrieves a record from ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  getRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's get() method.
     * Note how the object was instantiated in the constructor().
     * get() takes a callback function.
     */
    let data = this.connector.get(callback);

    // if (data) {
    //     const jsonBody = JSON.parse(data.body);
    //     const results = jsonBody.result;

    //     results.forEach(result => {
    //         result.change_ticket_number = result.number;
    //         result.change_ticket_key = result.sys_id;
            
    //         delete result.number;
    //         delete result.sys_id;
    //         delete result.parent;
    //         delete result.reason;
    //         delete result.watch_list;
    //         delete result.upon_reject;
    //         delete result.sys_updated_on;
    //         delete result.type;
    //         delete result.approval_history;
    //         delete result.test_plan;
    //         delete result.cab_delegate;
    //         delete result.requested_by_date;
    //         delete result.state;
    //         delete result.sys_created_by;
    //         delete result.knowledge;
    //         delete result.order;
    //         delete result.phase;
    //         delete result.cmdb_ci;
    //         delete result.delivery_plan;
    //         delete result.contract;
    //         delete result.impact;
    //         delete result.work_notes_list;
    //         delete result.sys_domain_path;
    //         delete result.cab_recommendation;
    //         delete result.production_system;
    //         delete result.review_date;
    //         delete result.business_duration;
    //         delete result.group_list;
    //         delete result.requested_by;
    //         delete result.change_plan;
    //         delete result.approval_set;
    //         delete result.implementation_plan;
    //         delete result.approval_history;
    //         delete result.test_plan;
    //         delete result.correlation_display;
    //         delete result.delivery_task;
    //         delete result.additional_assignee_list;
    //         delete result.outside_maintenance_schedule;
    //         delete result.end_date;
    //         delete result.short_description;
    //         delete result.std_change_producer_version;
    //         delete result.service_offering;
    //         delete result.sys_class_name;
    //         delete result.closed_by;
    //         delete result.follow_up;
    //         delete result.reassignment_count;
    //         delete result.review_status;
    //         delete result.assigned_to;
    //         delete result.start_date;
    //         delete result.sla_due;
    //         delete result.comments_and_work_notes;
    //         delete result.escalation;
    //         delete result.upon_approval;
    //         delete result.correlation_id;
    //         delete result.made_sla;
    //         delete result.backout_plan;
    //         delete result.conflict_status;
    //         delete result.sys_updated_by;
    //         delete result.opened_by;
    //         delete result.user_input;
    //         delete result.sys_created_on;
    //         delete result.on_hold_task;
    //         delete result.sys_domain;
    //         delete result.closed_at;
    //         delete result.review_comments;
    //         delete result.business_service;
    //         delete result.time_worked;
    //         delete result.expected_start;
    //         delete result.opened_at;
    //         delete result.phase_state;
    //         delete result.cab_date;
    //         delete result.work_notes;
    //         delete result.close_code;
    //         delete result.assignment_group;
    //         delete result.on_hold_reason;
    //         delete result.calendar_duration;
    //         delete result.close_notes;
    //         delete result.contact_type;
    //         delete result.cab_required;
    //         delete result.urgency;
    //         delete result.scope;
    //         delete result.company;
    //         delete result.justification;
    //         delete result.activity_due;
    //         delete result.comments;
    //         delete result.approval;
    //         delete result.due_date;
    //         delete result.sys_mod_count;
    //         delete result.on_hold;
    //         delete result.sys_tags;
    //         delete result.conflict_last_run;
    //         delete result.unauthorized;
    //         delete result.location;
    //         delete result.risk;
    //         delete result.category;
    //         delete result.risk_impact_analysis;
    //     });
    //     var documents = results;
    // }

    // return documents;
  }

  /**
   * @memberof ServiceNowAdapter
   * @method postRecord
   * @summary Create ServiceNow Record
   * @description Creates a record in ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  postRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's post() method.
     * Note how the object was instantiated in the constructor().
     * post() takes a callback function.
     */
    this.connector.post(callback);
  }
}

module.exports = ServiceNowAdapter;