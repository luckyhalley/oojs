var assert = require("assert");
require('../../src/oojs.js');
require('../../src/oojs/event.js');

describe('oojs.event', function () {
    describe('basic', function () {
        it('clone property', function () {
            var eventClass = oojs.using('oojs.event');
            assert.equal(eventClass.__clones.length, 0);
            var ev = oojs.create(eventClass);
            assert.ok( ev.hasOwnProperty('eventList'));
            assert.ok( ev.hasOwnProperty('groupList'));
            assert.ok( ev.hasOwnProperty('eventGroupIndexer'));
        });

        it('bind-emit', function () {
            var ev = oojs.create(oojs.event);
            ev.bind('ev1', function (data) {
                assert.equal(data, 'ev1-data');
            });
            ev.bind('ev2', function (data) {
                assert.equal(data, 'ev2-data');
            });
            ev.bind('ev3', function (data) {
                assert.equal(data, 'ev3-data');
            });
            ev.bind('ev4', function (data) {
                assert.equal(data, 'ev4-data');
            });

            ev.emit('ev1', 'ev1-data');
            ev.emit('ev2', 'ev2-data');
            ev.emit('ev3', 'ev3-data');
            ev.emit('ev4', 'ev4-data');
        });

        it('emit-bind', function () {
            var ev = oojs.create(oojs.event);
            var times = 0;
            ev.emit('ev1', 'ev1-data');
            ev.emit('ev2', 'ev2-data');
            ev.emit('ev3', 'ev3-data');
            ev.emit('ev4', 'ev4-data');
            ev.bind('ev1', function (data) {
                times++;
                assert.equal(data, 'ev1-data');
            });
            ev.bind('ev2', function (data) {
                times++;
                assert.equal(data, 'ev2-data');
            });
            ev.bind('ev3', function (data) {
                times++;
                assert.equal(data, 'ev3-data');
            });
            ev.bind('ev4', function (data) {
                times++;
                assert.equal(data, 'ev4-data');
            });
            assert.equal(times, 4);
        });

        it('time=-1', function () {
            var ev = oojs.create(oojs.event);
            var times = 0;
            ev.bind('ev1', function (data) {
                times++;
                assert.equal(data, 'ev1-data');
            }, -1);
            ev.emit('ev1', 'ev1-data');
            ev.emit('ev1', 'ev1-data');
            ev.emit('ev1', 'ev1-data');
            assert.equal(times, 3);
        });

        it('time=1', function () {
            var ev = oojs.create(oojs.event);
            var times = 0;
            ev.bind('ev1', function (data) {
                times++;
                assert.equal(data, 'ev1-data');
            }, 1);
            ev.emit('ev1', 'ev1-data');
            ev.emit('ev1', 'ev1-data');
            ev.emit('ev1', 'ev1-data');
            assert.equal(times, 1);
        });

        it('multi-callbacks', function () {
            var ev = oojs.create(oojs.event);
            var times = 0;
            ev.bind('ev1', function (data) {
                times++;
                assert.equal(data, 'ev1-data');
            });
            ev.bind('ev1', function (data) {
                times++;
                assert.equal(data, 'ev1-data');
            });
            ev.bind('ev1', function (data) {
                times++;
                assert.equal(data, 'ev1-data');
            });
            ev.bind('ev1', function (data) {
                times++;
                assert.equal(data, 'ev1-data');
            });

            ev.emit('ev1', 'ev1-data');
            assert.equal(times, 4);
        });

    });

    describe('group', function () {
        it('basic', function () {
            var ev = oojs.create(oojs.event);
            var groupEmitArray = [];
            ev.bind('ev1', function (data) {
                return data;
            });

            ev.bind('ev2', function (data) {
                return data;
            });

            ev.bind('ev3', function (data) {
                return data;
            });

            ev.bind('ev4', function (data) {
                return data;
            });

            ev.bind('ev5', function (data) {
                return data;
            });

            ev.group('groupA', 'ev1', function (data) {
                groupEmitArray.push('groupA');
                assert.equal(data.ev1, 'ev1-data');
            });

            ev.group('groupC', [
                'ev4',
                'ev5'
            ], function (data) {
                groupEmitArray.push('groupC');
                assert.equal(data.ev4, 'ev4-data');
                assert.equal(data.ev5, 'ev5-data');
            });

            ev.group('groupB', [
                'ev2',
                'ev3'
            ], function (data) {
                groupEmitArray.push('groupB');
                assert.equal(data.ev2, 'ev2-data');
                assert.equal(data.ev3, 'ev3-data');
            });

            ev.queue('groupA', 'groupB', 'groupC');
            ev.emit('ev4', 'ev4-data');
            ev.emit('ev5', 'ev5-data');
            ev.emit('ev1', 'ev1-data');
            ev.emit('ev3', 'ev3-data');
            ev.emit('ev2', 'ev2-data');
            assert.deepEqual(groupEmitArray.sort(), ['groupA', 'groupB', 'groupC'].sort());
        });


    });
});