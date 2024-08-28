import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RbacServiceMock {
  isReadOnly(): boolean {
    return true;
  }

  isReadWrite(): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  hasValidRoles(): boolean {
    return true;
  }

  getPreferredUserName(): string {
    return "username1";
  }
}
