import { system } from "./server";

class Scheduler {
    static #instance;
    nextRunId = 0;
    scheduled = new Map();
    currentTick = 0;

    static getInstance() {
        if (Scheduler.#instance)
            return Scheduler.#instance;
        Scheduler.#instance = new Scheduler();
        return Scheduler.#instance;
    }

    advanceTicks(n = 1) {
        for (let i = 0; i < n; i++) {
            this.currentTick++;
            system.currentTick = this.currentTick;
            for (const [id, entry] of [...this.scheduled.entries()]) {
                if (!this.scheduled.has(id))
                    continue;
                if (entry.nextTick <= this.currentTick) {
                    entry.callback();
                    if (entry.interval === null)
                        this.scheduled.delete(id);
                    else if (this.scheduled.has(id))
                        entry.nextTick = this.currentTick + entry.interval;
                }
            }
        }
    }

    reset() {
        this.nextRunId = 1;
        this.scheduled.clear();
        this.currentTick = 0;
        system.currentTick = 0;
    }

    scheduleDelay(callback, tickDelay = 1) {
        const id = this.nextRunId++;
        this.scheduled.set(id, {
            callback,
            nextTick: this.currentTick + Math.max(tickDelay, 1),
            interval: null
        });
        return id;
    }

    scheduleInterval(callback, tickInterval = 1) {
        const id = this.nextRunId++;
        this.scheduled.set(id, {
            callback,
            nextTick: this.currentTick + Math.max(tickInterval, 1),
            interval: Math.max(tickInterval, 1)
        });
        return id;
    }

    delete(runId) {
        this.scheduled.delete(runId);
    }
}

export const scheduler = Scheduler.getInstance();