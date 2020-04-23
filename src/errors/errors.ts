class ApplicationError {
    message: string;
    reason: string;

    constructor(rsn?: string) { // the ? indicates field is optional
        this.message = 'An unexpected error occurred.';
        rsn ? (this.reason = rsn) : this.reason = 'Unspecified reason.';
    }

    setMessage(msg: string) {
        this.message = msg;
    }
}

class ResourcePersistenceError extends ApplicationError {

    constructor (rsn?: string) {
        super(rsn);
        super.message = 'The resource was not persisted.';
    }
    
}

class ResourceNotFoundError extends ApplicationError {

    constructor (rsn?: string) {
        super(rsn);
        super.setMessage('No resource found using provided criteria.'); // inconsistency just for demo
    }
    
}

class BadRequestError extends ApplicationError {


    constructor (rsn?: string) {
        super(rsn);
        super.message = 'Unspecified reason.';
    }
}

class AuthenticationError extends ApplicationError {

    constructor(rsn?: string) {
        super(rsn);
        super.message = 'Authentication failed';
    }

}

class NotImplementedError extends ApplicationError {

    constructor(reason?: string) {
        super(reason);
        super.message = 'No implementation yet.';
    }
}

export { // export default for arrays or nameless functions
    ResourceNotFoundError,
    ResourcePersistenceError,
    BadRequestError,
    AuthenticationError,
    NotImplementedError
};