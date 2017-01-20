export default class NavNode {
    public subwebs: Array<NavNode>;
   public level:number;
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