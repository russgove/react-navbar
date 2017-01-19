export default class NavNode{
    children:Array<NavNode>;
    constructor(
        public id:string,
        public title:string,
        public url:string,
    )
    {
        this.children=[];
    }
}