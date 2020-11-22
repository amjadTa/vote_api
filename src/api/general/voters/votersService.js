
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
        const did_vote = await this.repository.didVote(body.id);
        if (did_vote) { throw new Error('already vote'); }
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
        if (query.role == 'admin' || query.role == 'manager') {
            voters = await this.repository.allVoters();
        }
        else {
            if (query.number != '' && query.light != "") {
                if (query.circle == 'No') {
                    voters = await this.repository.noCircleToCall(query.number, query.light, query.user_name);
                }
                else {
                    voters = await this.repository.allList(query.number, query.circle, query.light, query.user_name);
                }
            }
            else if (query.number != '' && query.light == "") {
                if (query.circle == 'No') {
                    voters = await this.repository.lightEmptyNoCircleList(query.number, query.user_name);
                }
                else {
                    voters = await this.repository.lightEmptyList(query.number, query.circle, query.user_name);
                }
            }

            else if (query.number == '' && query.light != "") {
                if (query.circle == 'No') {
                    voters = await this.repository.numberEmptyNoCricleList(query.light, query.user_name);
                }
                else {
                    voters = await this.repository.numberEmptyList(query.circle, query.light, query.user_name);
                }
            }

            else {
                if (query.circle == 'No') {
                    voters = await this.repository.allDefualtsNoCircleList(query.user_name);
                }
                else {
                    voters = await this.repository.allDefualtsList(query.circle, query.user_name);
                }
            }
        }
        const result = voters.map(item => this.votersToPhone(item));
        return result;
    }

    async votersReport(query) {
        const result = await this.repository.votersReport(query);
        return result;
    }

    async circlesReport(query) {
        const result = await this.repository.circlesReport(query);
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
            did_vote: true,
            cell_number: voter.phone,
            "2020_support": voter.support,
            assign_by: voter.user
        } : {};
    }

    calphisToDto(calphi) {
        return calphi ? {
            box: calphi.calphi_id,
        } : {};
    }

    circle1ToDto(circle) {
        return circle || circle.circle_1 || circle.circle_1 != '' ? {
            circle: circle.circle_1,
        } : {};
    }

    circle2ToDto(circle) {
        return circle || circle.circle_2 || circle.circle_2 != '' ? {
            circle: circle.circle_2,
        } : {};
    }
}

module.exports = VotersService;
