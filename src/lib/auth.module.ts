import {ModuleWithProviders, NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {OAuthModule} from "angular-oauth2-oidc";
import {AuthService} from "./auth.service";

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot({
        resourceServer: {
          allowedUrls: ["http"],
          sendAccessToken: true
        }
      }
    ),
  ]
})
export class AuthModule {
    public static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService
            ]
        };
    }
}
