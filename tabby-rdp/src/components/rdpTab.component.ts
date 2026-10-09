import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker'
import { Component, Injector, ViewChild, ElementRef, HostListener } from '@angular/core'
import { BaseTabComponent, RecoveryToken, GetRecoveryTokenOptions } from 'tabby-core'
import { RdpProfile, RdpSession } from '../session'

/** @hidden */
@Component({
    selector: 'rdp-tab',
    templateUrl: './rdpTab.component.pug',
    styleUrls: ['./rdpTab.component.scss'],
})
export class RdpTabComponent extends BaseTabComponent {
    profile: RdpProfile
    session: RdpSession | null = null
    connected = false
    statusText = ''

    @ViewChild('canvas', { static: false }) canvasRef: ElementRef<HTMLCanvasElement>

    constructor (injector: Injector) {
        super(injector)
    }

    ngOnInit (): void {
        this.setTitle(this.profile.name || this.profile.options.host)
        this.initializeSession()
    }

    async initializeSession (): Promise<void> {
        this.session = new RdpSession(this.injector, this.profile)
        this.subscribeUntilDestroyed(this.session.serviceMessage$, msg => {
            this.statusText = msg
        })

        try {
            await this.session.start()
            this.connected = true
        } catch (e: any) {
            this.statusText = `Connection failed: ${e.message}`
        }
    }

    async reconnect (): Promise<void> {
        if (this.session) {
            await this.session.destroy()
        }
        await this.initializeSession()
    }

    onMouseMove (event: MouseEvent): void {
        if (!this.session || !this.connected) {
            return
        }
        const rect = this.canvasRef?.nativeElement.getBoundingClientRect()
        if (rect) {
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            this.session.sendPointerEvent(x, y, event.button, event.buttons > 0)
        }
    }

    onMouseDown (event: MouseEvent): void {
        if (!this.session || !this.connected) {
            return
        }
        const rect = this.canvasRef?.nativeElement.getBoundingClientRect()
        if (rect) {
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            this.session.sendPointerEvent(x, y, event.button, true)
        }
    }

    onMouseUp (event: MouseEvent): void {
        if (!this.session || !this.connected) {
            return
        }
        const rect = this.canvasRef?.nativeElement.getBoundingClientRect()
        if (rect) {
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            this.session.sendPointerEvent(x, y, event.button, false)
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown (event: KeyboardEvent): void {
        if (this.hasFocus && this.session && this.connected) {
            this.session.sendKeyEvent(event.key, true, event.code)
        }
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp (event: KeyboardEvent): void {
        if (this.hasFocus && this.session && this.connected) {
            this.session.sendKeyEvent(event.key, false, event.code)
        }
    }

    async getRecoveryToken (options?: GetRecoveryTokenOptions): Promise<RecoveryToken | null> {
        return {
            type: 'rdp-tab',
            profile: this.profile,
        }
    }

    async canClose (): Promise<boolean> {
        if (!this.session?.open) {
            return true
        }
        return true
    }

    ngOnDestroy (): void {
        if (this.session) {
            this.session.destroy()
        }
        super.ngOnDestroy()
    }
}
