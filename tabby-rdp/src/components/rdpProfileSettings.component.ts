import { Component } from '@angular/core'
import { FullyDefined, ProfileSettingsComponent } from 'tabby-core'
import { RdpProfile } from '../session'
import { RdpProfilesService } from '../profiles'

/** @hidden */
@Component({
    templateUrl: './rdpProfileSettings.component.pug',
})
export class RdpProfileSettingsComponent implements ProfileSettingsComponent<RdpProfile, RdpProfilesService> {
    profile: FullyDefined<RdpProfile>
}
