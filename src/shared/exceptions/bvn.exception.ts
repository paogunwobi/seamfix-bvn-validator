import { HttpException, HttpStatus } from '@nestjs/common';

export class BvnException extends HttpException {
    constructor(message: string, code: string) {
        super({ message, code }, HttpStatus.BAD_REQUEST);
    }
}

export class InvalidBvnException extends BvnException {
    constructor(bvn: string) {
        super(`The searched BVN is invalid`, '02');
        this.bvn = bvn;
    }

    readonly bvn: string;
}

export class BvnNotFoundException extends BvnException {
    constructor(bvn: string) {
        super(`The searched BVN does not exist`, '01');
        this.bvn = bvn;
    }

    readonly bvn: string;
}
