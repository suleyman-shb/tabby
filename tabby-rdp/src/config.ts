import { ConfigProvider } from 'tabby-core'

/** @hidden */
export class RdpConfigProvider extends ConfigProvider {
    defaults = {
        hotkeys: {
            'restart-rdp-session': [],
        },
    }

    platformDefaults = { }
}
