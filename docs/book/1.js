// function* genDemo() {
//     console.log('开始执行第一段');
//     yield 'generator 2';

//     console.log('开始执行第二段');
//     yield 'generator 2';

//     console.log('开始执行第三段');
//     yield 'generator 2';

//     console.log('执行结束');
//     return 'generator 2';
// }

// console.log('main 0');
// let gen = genDemo();
// console.log(gen.next().value);
// console.log('main 1');
// console.log(gen.next().value);
// console.log('main 2');
// console.log(gen.next().value);
// console.log('main 3');
// console.log(gen.next().value);
// console.log('main 4');

// const obj = {
//     name: 'objName',
//     say() {
//         console.log(this.name);
//     },
//     read: () => {
//         console.log(this.name);
//     },
// };
// obj.say();
// obj.read();

function foo() {
    var a = { name: 'lucyStar' };
    var b = a;
    a.name = 'litterStar';
    console.log(a);
    console.log(b);
}
foo();
// { name: 'litterStar' }, { name: 'litterStar' }
