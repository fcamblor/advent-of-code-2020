import {D16_INPUTS} from "./2020-16.inputs";
import {D16Constraint, D16TicketChecker} from "../src/2020-16";


test("Q1 reading constraints", () => {
    let constraints = D16Constraint.createFrom(D16_INPUTS.constraints);
    expect(constraints).toEqual([
        new D16Constraint("departure location",[{min:45, max:309}, {min:320, max:962}]),
        new D16Constraint("departure station",[{min:27, max:873}, {min:895, max:952}]),
        new D16Constraint("departure platform",[{min:45, max:675}, {min:687, max:962}]),
        new D16Constraint("departure track",[{min:42, max:142}, {min:164, max:962}]),
        new D16Constraint("departure date",[{min:38, max:433}, {min:447, max:963}]),
        new D16Constraint("departure time",[{min:39, max:703}, {min:709, max:952}]),
        new D16Constraint("arrival location",[{min:34, max:362}, {min:383, max:963}]),
        new D16Constraint("arrival station",[{min:26, max:921}, {min:934, max:954}]),
        new D16Constraint("arrival platform",[{min:38, max:456}, {min:480, max:968}]),
        new D16Constraint("arrival track",[{min:42, max:295}, {min:310, max:956}]),
        new D16Constraint("class",[{min:29, max:544}, {min:550, max:950}]),
        new D16Constraint("duration",[{min:44, max:725}, {min:749, max:963}]),
        new D16Constraint("price",[{min:37, max:494}, {min:509, max:957}]),
        new D16Constraint("route",[{min:25, max:170}, {min:179, max:966}]),
        new D16Constraint("row",[{min:32, max:789}, {min:795, max:955}]),
        new D16Constraint("seat",[{min:29, max:98}, {min:122, max:967}]),
        new D16Constraint("train",[{min:45, max:403}, {min:418, max:956}]),
        new D16Constraint("type",[{min:36, max:81}, {min:92, max:959}]),
        new D16Constraint("wagon",[{min:25, max:686}, {min:692, max:955}]),
        new D16Constraint("zone",[{min:37, max:338}, {min:353, max:960}]),
    ]);
})

test("Q1 tickets check", () => {
    let constraints = D16Constraint.createFrom(D16_INPUTS.constraints);
    expect(new D16TicketChecker(constraints).sumOfInvalidNumbers(D16_INPUTS.nearbyTickets)).toEqual(23009);
})

test("Q2 constraint index matching", () => {
    let constraints = D16Constraint.createFrom(D16_INPUTS.constraints);
    let ticketChecker = new D16TicketChecker(constraints);
    const validTicketsMatches = ticketChecker.filterValidTickets(D16_INPUTS.nearbyTickets+"\n"+D16_INPUTS.myTicket);
    let constraintIndexes = ticketChecker.guessConstraintsTicketIndexes(validTicketsMatches);

    let myTicketNumbers = D16_INPUTS.myTicket.split(",").map(Number);
    const result = constraintIndexes.filter(c => c.constraint.name.indexOf("departure") === 0).reduce((result, constraint) => {
        return result * myTicketNumbers[constraint.numColIdx];
    }, 1);

    expect(result).toEqual(10458887314153);
})