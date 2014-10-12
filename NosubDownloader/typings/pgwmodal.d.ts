
interface PgwModalOption {
    content?: string;
    target?: string;
    url?: string;
    title?: string;
    titleBar?: boolean;
    mainClassName?: string;
    backdropClassName?: string;
    maxWidth?: number;
    angular?: boolean;
    modalData?: any;
    ajaxOptions?: any;
    closable?: boolean;
    closeContent?: string;
    closeOnEscape?: boolean;
    closeOnBackgroundClick?: boolean;
    loadingContent?: string;
    errorContent?: string;
    pushContent?: string;
}

interface ZeptoStatic {
    pgwModal(option: PgwModalOption): void;
    pgwModal(action: string): void;
}