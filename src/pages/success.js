import Header from '../components/header';
import {useRouter} from 'next/router';
import Link from 'next/link';

export default function Success() {
    const router = useRouter();
    const {orderId} = router.query;
    return(
        <div className="flex flex-col bg-background h-[100dvh] w-full justify-center">
            <Header />
            <div className="max-w-7/8 md:max-w-3xl mx-auto bg-main-pink/30 border-2 border-dashed border-main-brown/20 rounded-3xl p-6 md:p-12 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-text-espresso mb-4">
                    Thank you for supporting Eleny Makes 
                </h2>
                <div className="space-y-4 text-text-espresso/80 leading-relaxed text-sm md:text-base mb-6">
                    <p>
                        Please look out for your patterns and receipt, they should be arriving to your inbox soon. Below is your order number for your reference.
                    </p>
                    
                    <p className="font-medium bg-white/50 py-2 px-4 rounded-lg inline-block border border-main-brown/5">
                        ✨ <span className="text-text-espresso font-bold">Order Number</span>
                        <span className="text-text-espresso font-bold"> #{orderId}</span>
                    </p>

                    <p>
                        If you have any issues, or don't see your patterns in your inbox or spam soon, please reach out to <span className="text-text-espresso font-bold"><a href="mailto:support@elenymakes.com">support@elenymakes.com</a></span>
                    </p>
                </div>
                <Link 
                    href="/"
                    className="group relative px-8 py-3 bg-neutral-accent border-2 border-accent-green rounded-xl font-primary text-text-espresso transition-all duration-300 hover:bg-accent-green hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                    <span className="relative z-10">Return to home</span>
                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                {/* Decorative Element seen in disclaimer */}
                <div className="mt-6 text-text-espresso/30 text-2xl">
                    ♡
                </div>
            </div>
        </div>

        
    );
}