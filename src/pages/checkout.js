import purchaseHandler from '../logic/purchaseHandler';

export default function Checkout({items}){
    // Need successful purchase handling logic
    let successful_purchase = false;

    // How do i call the function with a param for button
    return (
        <div className="">
            <input className="" placeholder="Email"/>
            <input className="" placeholder="Payment stuff"/>
            <button className="" onClick={purchaseHandler(info)}/>
        </div>
    )
}