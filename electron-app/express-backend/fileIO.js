const fs = require('fs');
const path = require('path');

class FileIO {
    constructor(relPath, initJSON) {
        this.file = path.join(__dirname, relPath);
        this.json = initJSON;
        const storageDir = path.join(__dirname, 'storage');
        if (!fs.existsSync(storageDir)) {
            console.log(this.file + ' does not exist!\nCreating the file...');
            fs.mkdirSync(storageDir);
        } else {
            if (!fs.existsSync(this.file)) {
                this.updateFile();
            }
            this.readFile();
        }
    }

    updateFile = function() {
        fs.writeFileSync(this.file, JSON.stringify(this.json));
    }

    readFile = function() {
        this.json = JSON.parse(fs.readFileSync(this.file));
        return this.json;
    }
}

class UsersIO extends FileIO {
    constructor() {
        super('storage/users.json', { users: [] });
    }

    addUser = function(query) {
        if (Object.keys(query).length !== 4) {
            return 400;
        }
        this.readFile();

        let users = this.json.users;
        const duplicate = users.map(u => u.username).indexOf(query.username);
        if (duplicate === -1) {
            users.push(query);
        } else {
            users[duplicate] = query;
        }

        this.json.users = users;
        this.updateFile();
        return 200;
    }
}

class EventsIO extends FileIO {
    constructor() {
        super('storage/events.json', { events: [] } );
    }

    putEvent = function(event) {
        if (Object.keys(event).length < 6) {
            return 400;
        }
        this.readFile();

        let events = this.json.events;
        let duplicate = events.map(e => e.id).indexOf(event.id);
        if (duplicate === -1) {
            events.push(event);
        } else {
            events[duplicate] = event;
        }

        this.json.events = events;
        this.updateFile();
        return 200;
    }

    deleteEvent = function(query) {
        if (!query.id) {
            return 400;
        }

        let events = this.json.events;
        const found = events.map(e => e.id).indexOf(Number(query.id));
        if (found === -1) {
            return 401;
        }
        events.splice(found, 1);
        this.json.events = events;
        this.updateFile();
        return 200;
    }
}

class RSVPsIO extends FileIO {
    constructor() {
        super('storage/rsvps.json', { rsvps: {} } );
    }

    getRSVPs = function(query) {
        if (!query.id) {
            return 400;
        }

        const rsvps = this.json.rsvps;
        if (!rsvps[query.id]) {
            return [];
        }
        return rsvps[query.id];
    }

    putRSVP = function(query) {
        if (Object.keys(query).length !== 4) {
            return 400;
        }

        const rsvp = {
            username: query.username,
            name: query.name,
            status: parseInt(query.status)
        };
        let rsvps = this.json.rsvps;
        if (!rsvps[query.id]) {
            rsvps[query.id] = [rsvp];
        } else {
            const duplicate = rsvps[query.id].map(r => r.username).indexOf(query.username);
            if (duplicate === -1) {
                rsvps[query.id].push(rsvp);
            } else {
                rsvps[query.id][duplicate] = rsvp;
            }
        }

        this.json.rsvps = rsvps;
        this.updateFile();
        return 200;
    }

    deleteRSVP = function(query) {
        if (Object.keys(query).length !== 2) {
            return 400;
        }

        let rsvps = this.json.rsvps;
        if (!rsvps[query.id]) {
            return 401;
        }
        const found = rsvps[query.id].map(u => u.username).indexOf(query.username);
        if (found === -1) {
            return 402;
        }
        rsvps[query.id].splice(found, 1);

        this.json.rsvps = rsvps;
        this.updateFile();
        return 200;
    }

    deleteEvent = function(query) {
        let rsvps = this.json.rsvps;
        delete rsvps[query.id];

        this.json.rsvps = rsvps;
        this.updateFile();
        return 200;
    }
}

const uIO = new UsersIO();
const eIO = new EventsIO();
const rIO = new RSVPsIO();

module.exports = { uIO, eIO, rIO };