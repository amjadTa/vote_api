
const VotersRepository = require('./votersRepository');


class VotersService {
    constructor() {
        this.repository = new VotersRepository();
    }

    async findByid(query) {
        const voter = await this.repository.findById(query.id);
        const result = this.voterToDto(voter);
        return result;
    }

    async findByBox(query) {
        const voter = await this.repository.findByBox(query.boxNumber, query.serial);
        const result = this.voterToDto(voter);
        return result;
    }

    async calphisNumbers() {
        const calphis = await this.repository.calphisNumbers();
        const result = calphis.map(item => this.calphisToDto(item));
        return result;
    }

    async circles() {
        const circles = await this.repository.circles();
        const result = circles.filter((item, index, arr) => {
            return arr.indexOf(item) === index;
        });
        return result;
    }
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

    async updateVoter(body) {
        return await this.repository.UpdateVoter(body.id);
    }
    
    async updateContactMade(body) {
        return await this.repository.updateContactMade(body.id);
    }

    addVoter(body) {
        const voter = this.addVoterDto(body);
        return this.repository.add(voter);
    }

    async list(query) {
        let voters;
        if(query.number != '' && query.light != "") {
            voters = await this.repository.allList(query.number, query.circle, query.light);
        }
        else if(query.number != '' && query.light == "") {
            voters = await this.repository.lightEmptyList(query.number, query.circle);
        }

        else if(query.number == '' && query.light != "") {
            voters = await this.repository.numberEmptyList(query.circle, query.light);
        }

        else {
            voters = await this.repository.allDefualtsList(query.circle);
        }

        const result = voters.map(item => this.votersToPhone(item));
        return result;
    }

    votersToPhone(voter) {
        return voter ? {
            first_name: voter._id.firs_name,
            last_name: voter._id.last_name,
            phone: voter._id.cell_number,
            light: voter._id['2020_support'],
            id: voter._id.voter_id
        } : {};
    }

    voterToDto(voter) {
        return voter ? {
            first_name: voter.firs_name,
            last_name: voter.last_name,
            calphi_index: voter.calphi_index,
            calphi_number: voter.calphi_number,
            id: voter.voter_id
        } : {};
    }

    addVoterDto(voter) {
        return voter ? {
            calphi_index: voter.box_index,
            calphi_number: voter.box_number,
            firs_name: voter.first_name,
            last_name: voter.last_name,
            voter_id: voter.id,
            did_vote: true
        } : {};
    }

    calphisToDto(calphi) {
        return calphi ? {
            box: calphi.calphi_id,
        } : {};
    }

    circle1ToDto(circle) {
        return circle || circle.circle_1 ||  circle.circle_1 != ''? {
            circle: circle.circle_1,
        } : {};
    }

    circle2ToDto(circle) {
        return circle || circle.circle_2 ||  circle.circle_2 != ''? {
            circle: circle.circle_2,
        } : {};
    }
}

module.exports = VotersService;
