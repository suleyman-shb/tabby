import { Injectable } from '@angular/core'
import { NewTabParameters, PartialProfile, TranslateService, QuickConnectProfileProvider } from 'tabby-core'
import { RdpProfileSettingsComponent } from './components/rdpProfileSettings.component'
import { RdpTabComponent } from './components/rdpTab.component'
import { RdpProfile } from './session'

@Injectable({ providedIn: 'root' })
export class RdpProfilesService extends QuickConnectProfileProvider<RdpProfile> {
    id = 'rdp'
    name = 'RDP'
    supportsQuickConnect = true
    settingsComponent = RdpProfileSettingsComponent
    configDefaults = {
        options: {
            host: null,
            port: 3389,
            user: '',
            domain: '',
            password: '',
            width: 1280,
            height: 720,
            bitsPerPixel: 32,
        },
    }

    constructor (private translate: TranslateService) { super() }

    async getBuiltinProfiles (): Promise<PartialProfile<RdpProfile>[]> {
        return [
            {
                id: `rdp:template`,
                type: 'rdp',
                name: this.translate.instant('RDP session'),
                icon: 'fas fa-desktop',
                options: {
                    host: '',
                    port: 3389,
                    user: '',
                    domain: '',
                    password: '',
                    width: 1280,
                    height: 720,
                },
                isBuiltin: true,
                isTemplate: true,
            },
        ]
    }

    async getNewTabParameters (profile: RdpProfile): Promise<NewTabParameters<RdpTabComponent>> {
        return {
            type: RdpTabComponent,
            inputs: { profile },
        }
    }

    getSuggestedName (profile: RdpProfile): string|null {
        return this.getDescription(profile) || null
    }

    getDescription (profile: RdpProfile): string {
        return profile.options.host ? `${profile.options.host}:${profile.options.port ?? 3389}` : ''
    }

    quickConnect (query: string): PartialProfile<RdpProfile> {
        let host = query
        let port = 3389
        if (host.includes('[')) {
            port = parseInt(host.split(']')[1].substring(1)) || 3389
            host = host.split(']')[0].substring(1)
        } else if (host.includes(':')) {
            const parts = host.split(':')
            host = parts[0]
            port = parseInt(parts[1]) || 3389
        }

        return {
            name: query,
            type: 'rdp',
            options: {
                host,
                port,
            },
        }
    }

    intoQuickConnectString (profile: RdpProfile): string | null {
        let s = profile.options.host
        if (profile.options.port && profile.options.port !== 3389) {
            s = `${s}:${profile.options.port}`
        }
        return s
    }
}
