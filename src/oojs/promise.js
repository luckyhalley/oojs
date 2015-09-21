/**
 * @file promise��, ֧�ֱ�׼��promiseģʽ
 * @author zhangziqiu@qq.com
 */

oojs.define({
    name: 'promise',
    namespace: 'oojs',
    deps: {
        event: 'oojs.event'
    },

    /**
     * ���캯��
     * @param {Function} func ����ǩ��Ϊ func(resolve, reject)
     */
    promise: function (func) {
        this.ev = oojs.create(this.event);
        if (func) {
            try {
                func(oojs.proxy(this, this._resolve), oojs.proxy(this, this._reject));
            }
            catch (ex) {
                this._reject(ex);
            }
        }
    },

    // promise״̬, ȡֵ����: fulfilled��rejected��pending
    status: 'pending',

    // onFulfilled ���� onRejected �������ص�����.
    data: null,

    // oojs.eventʵ��. ʹ��then����ʱ, ��Ϊevent����ע��OnFullfilled��OnRejected�¼�.
    ev: null,

    /**
     * OnFullfilled��OnRejected��Ĭ��ֵ,ֱ�ӷ��ش���Ĳ���
     * @param {*} data ���ݵĲ���
     * @return {*} ֱ�ӷ��ش����data����
     */
    defaultFunc: function (data) {
        return data;
    },

    /**
     * ���״̬Ϊ fullfilled
     * @public
     * @param {*} data ���ݵĲ���
     */
    _resolve: function (data) {
        // ���ص���һ��thenable����
        if (data && typeof data.then === 'function') {
            var insidePromise = data;
            var onFullfulled = oojs.proxy(this, function (data) {
                this._resolve(data);
            });
            var onRejected = oojs.proxy(this, function (data) {
                this._reject(data);
            });
            insidePromise.then(onFullfulled, onRejected);
        }
        // ���ص��Ƿ�promise����
        else {
            // �޸�״̬
            this.status = 'fulfilled';
            // ��������
            this.data = data;
            // ������һ��then�����󶨵ĺ���
            if (this.ev.eventList && this.ev.eventList['onRejected']) {
                try {
                    //���then�а󶨵�onFulfilled���������쳣, �����reject����
                    this.ev.emit('onFulfilled', data);
                }
                catch (ex) {
                    this._reject(ex);
                }
            }
        }
    },

    /**
     * ����һ��״̬Ϊ fulfilled �� promise����
     * @public
     * @param {*} data ���ݵĲ���
     * @return {Object} promise����
     */
    resolve: function (data) {
        var promise = oojs.create(this);
        promise._resolve(data);
        return promise;
    },

    /**
     * ���״̬Ϊ rejected
     * @public
     * @param {*} data ���ݵĲ���
     */
    _reject: function (data) {
        this.status = 'rejected';
        this.data = data;
        if (this.ev.eventList && this.ev.eventList['onRejected']) {
            this.ev.emit('onRejected', data);
        }
        return data;
    },

    /**
     * ����һ��״̬Ϊ rejected �� promise����
     * @public
     * @param {*} data ���ݵĲ���
     * @return {Object} promise����
     */
    reject: function (data) {
        var promise = oojs.create(this);
        promise._reject(data);
        return promise;
    },

    /**
     * ��node�еĻص�������ʽ,��callbackΪ���һ����ʽ�����ĺ���, ���promise��ʽ�ĺ���.
     * ���罫node�Դ�ģ��fs��readFile����, ���promise��ʽ�ĺ���:
     *      var readFilePromise = promise.promisify(fs.readFile);
     *      readFilePromise('test.txt').then(function(data){...});
     * @public
     * @param {Function} func node�ص���ʽ�ĺ���
     * @param {Object} thisObj ��������ʱ��this����,���Բ�����.
     * @return {Function}
     */
    promisify: function (func, thisObj) {
        var result = function () {
            var promise = oojs.create('oojs.promise');
            var args = Array.prototype.slice.apply(arguments);
            var callback = function (err) {
                if (err) {
                    this._reject(err);
                }
                else {
                    var returnDataArray = Array.prototype.slice.call(arguments, 1);
                    if (returnDataArray.length <= 1) {
                        returnDataArray = returnDataArray[0];
                    }
                    this._resolve(returnDataArray);
                }
            };
            args.push(oojs.proxy(promise, callback));
            func.apply(thisObj, args);
            return promise;
        }
        return result;
    },

    /**
     * ������һ���ɹ���onFulfilled����ʧ�ܣ�onRejected��ʱ�Ĵ������������µ�promise����������ʽ���á�
     * @public
     * @param {Function} onFulfilled �ɹ�ʱ���õĺ���
     * @param {Function} onRejected ʧ��ʱ���õĺ���
     * @return {Object} promise����
     */
    then: function (onFulfilled, onRejected) {
        onFulfilled = onFulfilled || this.defaultFunc;
        onRejected = onRejected || this.defaultFunc;

        // ����һ���µ�promise������
        var promise = oojs.create('oojs.promise');
        var promiseResolveCallback = oojs.proxy(promise, function (data) {
            this._resolve(data['onFulfilled']);
        });
        var promiseRejectCallback = oojs.proxy(promise, function (data) {
            this._reject(data['onRejected']);
        });

        this.ev.bind('onFulfilled', onFulfilled);
        this.ev.group('onFulfilledGroup', 'onFulfilled', promiseResolveCallback);
        this.ev.bind('onRejected', onRejected);
        this.ev.group('onRejectedGroup', 'onRejected', promiseRejectCallback);

        // ��⵱ǰ��promise�Ƿ��Ѿ�ִ�����
        if (this.status === 'fulfilled') {
            setTimeout(oojs.proxy(this, function () {
                this._resolve(this.data);
            }), 0);

        }
        else if (this.status === 'rejected') {
            setTimeout(oojs.proxy(this, function () {
                this._reject(this.data);
            }), 0);
        }

        //�����´�����promise
        return promise;
    },

    /**
     * ����ʧ��ʱ�Ĵ����� onRejected, �����µ�promise����������ʽ���á�
     * ��ͬ��: then(null, onRejected)
     * @public
     * @param {Function} onRejected ʧ��ʱ���õĺ���
     * @return {oojs.promise} promise����
     */
    catch: function (onRejected) {
        this.then(null, onRejected);
    },

    /**
     * ����promise�������飬�����е�����promise�������ʱ�������÷��ص�promiseΪonFullFilled
     * @public
     * @param {Array} promiseArray promise��������
     * @return {oojs.promise} promise����
     */
    all: function (promiseArray) {
        var promise = oojs.create(this);
        var ev = oojs.create('oojs.event');
        ev.bind('error', oojs.proxy(promise, function (error) {
            this._reject(error);
        }));

        var eventGroup = [];
        for (var i = 0, count = promiseArray.length; i < count; i++) {
            var tempEventName = 'event-' + (i + 1);
            eventGroup.push(tempEventName);
            var tempPromise = promiseArray[i];
            tempPromise.__eventName = tempEventName;
            tempPromise.allEvent = ev;
            ev.bind(tempEventName, function (data) {
                return data;
            });

            var tempPromiseOnFullfilled = function (data) {
                this.allEvent.emit(this.__eventName, data);
            }.proxy(tempPromise);
            var tempPromiseOnRejected = function (error) {
                this.allEvent.emit('error', error);
                this.allEvent.unbind();
            }.proxy(tempPromise);

            tempPromise.then(tempPromiseOnFullfilled, tempPromiseOnRejected);
        }

        ev.group('all', eventGroup, function (data) {
            var promiseData = [];
            for (var key in data) {
                promiseData.push(data[key]);
            }
            this._resolve(promiseData);
        }.proxy(promise));

        return promise;
    },

    /**
     * ����promise�������飬�����е�����promise����ֻҪ��һ�����ʱ�������÷��ص�promiseΪonFullFilled
     * @public
     * @param {Array} promiseArray promise��������
     * @return {oojs.promise} promise����
     */
    race: function (promiseArray) {
        var promise = oojs.create(this);
        var ev = oojs.create('oojs.event');
        ev.bind('success', oojs.proxy(promise, function (data) {
            this._resolve(data);
        }));
        ev.bind('error', oojs.proxy(promise, function (error) {
            this._reject(error);
        }));

        var eventGroup = [];
        for (var i = 0, count = promiseArray.length; i < count; i++) {
            var tempEventName = 'event-' + (i + 1);
            eventGroup.push(tempEventName);
            var tempPromise = promiseArray[i];
            var tempPromiseOnFullfilled = function (data) {
                this.emit('success', data);
                this.unbind();
            }.proxy(ev);
            var tempPromiseOnRejected = function (error) {
                this.emit('error', error);
                this.unbind();
            }.proxy(ev);
            tempPromise.then(tempPromiseOnFullfilled, tempPromiseOnRejected);
        }
        return promise;
    }

});