export default function Disclaimer() {
    return (
        <section className="w-full bg-background py-12 px-4">
            <div className="max-w-3xl mx-auto bg-main-pink/30 border-2 border-dashed border-main-brown/20 rounded-3xl p-8 md:p-12 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-text-espresso mb-4">
                    A Note from Eleny
                </h2>

                <div className="space-y-4 text-text-espresso/80 leading-relaxed text-sm md:text-base">
                    <p>
                        Thank you so much for visiting <span className="font-bold text-text-espresso">Eleny Makes</span>. 
                        I am so happy to share my designs with you!
                    </p>
                    
                    <p className="font-medium bg-white/50 py-2 px-4 rounded-lg inline-block border border-main-brown/5">
                        ✨ <span className="text-text-espresso font-bold">Important:</span> You are purchasing a 
                        <span className="text-text-espresso font-bold"> Digital Pattern</span>, not the physical finished item.
                    </p>

                    <p>
                        Each pattern includes detailed instructions for a range of sizes, 
                        guiding you step-by-step to create your own handcrafted piece. 
                    </p>
                </div>

                {/* Decorative Element */}
                <div className="mt-6 text-text-espresso/30 text-2xl">
                    ♡
                </div>
            </div>
        </section>
    );
}
