import { EMPTY, Observable } from "rxjs";

import { DnrFailure } from "src/app/models/dnr-failure.model";
import { Injectable } from "@angular/core";
import { Job } from "src/app/models/job.model";

@Injectable({
    providedIn: 'root'
})

export class JobDetailsFacadeServiceMock {

    loadDetails() {
        return EMPTY;
    }

    createJob() {
        return EMPTY;
    }

    reconcileJob() {
        return EMPTY;
    }

    reconcileAllJob() {
        return EMPTY;
    }

    duplicateJob() {
        return EMPTY;
    }

    deleteJob() {
        return EMPTY;
    }

    deleteFilteredJobs() {
        return EMPTY;
    }

    clearFailureState() {
        return EMPTY;
    }

    getJobDetails(): Observable<Job> {
        return EMPTY;
    }

    getJobId(): Observable<string> {
        return EMPTY;
    }

    getJobDetailsLoading(): Observable<boolean> {
        return EMPTY;
    }

    getJobDetailsFailure(): Observable<DnrFailure> {
        return EMPTY;
    }

    getJobDeleted(): Observable<boolean> {
        return EMPTY;
    }

    getFilteredJobsDeleted(): Observable<number> {
        return EMPTY;
    }

    getJobReconciled(): Observable<boolean> {
        return EMPTY;
    }

    getJobDuplicated(): Observable<boolean> {
        return EMPTY;
    }
}