import Header from '../components/header';

export default function Success() {
    return(
        <div className="flex flex-col bg-background min-h-screen w-full">
            <Header />
            <div className="p-10"/>
            <p>Congrats, you have purchased the items. Make sure to check your email for the patterns</p>
            <p>Yes, I know this page looks bad, it is still in development :)</p>
        </div>
    )
}