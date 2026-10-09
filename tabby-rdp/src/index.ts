import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ToastrModule } from 'ngx-toastr'
import TabbyCoreModule, { ConfigProvider, TabRecoveryProvider, HotkeyProvider, ProfileProvider } from 'tabby-core'

import { RdpProfileSettingsComponent } from './components/rdpProfileSettings.component'
import { RdpTabComponent } from './components/rdpTab.component'

import { RdpConfigProvider } from './config'
import { RecoveryProvider } from './recoveryProvider'
import { RdpHotkeyProvider } from './hotkeys'
import { RdpProfilesService } from './profiles'

/** @hidden */
@NgModule({
    imports: [
        NgbModule,
        CommonModule,
        FormsModule,
        ToastrModule,
        TabbyCoreModule,
    ],
    providers: [
        { provide: ConfigProvider, useClass: RdpConfigProvider, multi: true },
        { provide: TabRecoveryProvider, useClass: RecoveryProvider, multi: true },
        { provide: HotkeyProvider, useClass: RdpHotkeyProvider, multi: true },
        { provide: ProfileProvider, useExisting: RdpProfilesService, multi: true },
    ],
    declarations: [
        RdpProfileSettingsComponent,
        RdpTabComponent,
    ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class RdpModule { }
