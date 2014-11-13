declare class MediaType {
    type: string;
}

interface MediaTypeStatic {
    new (s: string): MediaType;
}

declare module "content-type" {
    var x: MediaTypeStatic;
    export = x;
} 