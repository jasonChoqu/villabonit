export interface IDirectivity {
    id: any;
    name: string;
    position: string;
    photo: string | null;
}

export interface IDirectivityCreateRequest {
    name: string;
    position: string;
    photo: string | File | null;
}

export interface IDirectivityUpdateRequest {
    name: string;
    position: string;
    photo: string | File | null;
}
