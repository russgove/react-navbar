export default class NavNode {
    subwebs: Array<NavNode>;
    level:number;
    constructor(
        public id: string,
        public title: string,
        public path: string,
        public parentLink: string,
        public description: string,
        
    ) {
        this.subwebs = [];
        this.level=0;
    }
}