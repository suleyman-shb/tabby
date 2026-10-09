import { Injectable, Injector } from '@angular/core'
import { TabRecoveryProvider, NewTabParameters } from 'tabby-core'
import { RdpTabComponent } from './components/rdpTab.component'

@Injectable()
export class RecoveryProvider extends TabRecoveryProvider<RdpTabComponent> {
    async recover (recoveryToken: any, _injector: Injector): Promise<NewTabParameters<RdpTabComponent> | null> {
        if (recoveryToken?.type === 'rdp-tab') {
            return {
                type: RdpTabComponent,
                inputs: {
                    profile: recoveryToken.profile,
                },
            }
        }
        return null
    }
}
