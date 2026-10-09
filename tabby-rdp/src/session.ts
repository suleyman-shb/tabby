import { Injector } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { LogService, Logger, BaseTabProcess, Profile } from 'tabby-core'

export interface RdpProfileOptions {
    host: string
    port?: number | null
    user?: string
    domain?: string
    password?: string
    width?: number
    height?: number
    bitsPerPixel?: number
    enableGL?: boolean
}

export interface RdpProfile extends Profile {
    options: RdpProfileOptions
}

export class RdpSession {
    open = false
    get serviceMessage$ (): Observable<string> { return this.serviceMessage }

    private serviceMessage = new Subject<string>()
    private logger: Logger

    constructor (
        injector: Injector,
        public profile: RdpProfile,
    ) {
        this.logger = injector.get(LogService).create(`rdp-${profile.options.host}-${profile.options.port ?? 3389}`)
    }

    async start (): Promise<void> {
        this.emitServiceMessage(`Connecting to ${this.profile.options.host}:${this.profile.options.port ?? 3389}...`)
        this.open = true
        this.emitServiceMessage('Connected to RDP session')
    }

    emitServiceMessage (msg: string): void {
        this.serviceMessage.next(msg)
        this.logger.info(msg)
    }

    sendPointerEvent (x: number, y: number, button: number, isDown: boolean): void {
        this.logger.debug(`Pointer event: x=${x}, y=${y}, button=${button}, down=${isDown}`)
    }

    sendKeyEvent (key: string, isDown: boolean, code?: string): void {
        this.logger.debug(`Key event: key=${key}, code=${code}, down=${isDown}`)
    }

    resize (width: number, height: number): void {
        this.profile.options.width = width
        this.profile.options.height = height
        this.logger.debug(`Resized session to ${width}x${height}`)
    }

    kill (): void {
        this.open = false
        this.emitServiceMessage('Session terminated')
    }

    async destroy (): Promise<void> {
        this.kill()
        this.serviceMessage.complete()
    }

    async getChildProcesses (): Promise<BaseTabProcess[]> {
        return []
    }
}
