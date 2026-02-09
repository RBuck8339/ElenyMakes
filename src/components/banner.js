export default function Banner(){
    return (
        <section className="relative w-full bg-main-pink py-28 px-4 flex flex-col items-center justify-center overflow-hidden shadow-md">
            
            {/* CROCHET TEXTURE: A subtle repeating 'stitch' pattern using your Accent Pink */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#F7B9C4 2px, transparent 2px)', backgroundSize: '24px 24px' }}>
            </div>

            {/* YARN LOOP DECORATION: A swooping green line behind the text */}
            <div className="absolute w-[120%] h-32 border-t-2 border-b-2 border-accent-green/20 rounded-[100%] rotate-[-5deg] pointer-events-none" />

            {/* Top Sheen (Shiny yarn effect) */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/40 shadow-[0_0_10px_white]" />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col items-center">

                {/* MAIN TITLE: Green Text on Pink Background */}
                <h1 
                    className="text-main-brown text-8xl md:text-9xl text-center leading-[0.8] p-10"
                    style={{ 
                        fontFamily: "'Monsieur La Doulaise', cursive",
                        // Adding a slight brown shadow improves legibility of green on pink
                        filter: "drop-shadow(0px 2px 2px rgba(83, 54, 56, 0.2))" 
                    }}
                >
                    Eleny Makes
                </h1>

                {/* Bottom decorative 'Needle' line */}
                <div className="mt-8 flex items-center gap-3 opacity-80">
                    <div className="w-2 h-2 rounded-full bg-accent-green" />
                    <div className="h-[2px] w-24 bg-accent-green rounded-full" />
                    <div className="w-2 h-2 rounded-full bg-accent-green" />
                </div>
            </div>

            {/* Soft Vignette to focus the eye */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(246,211,216,0.1)_100%)]" />
        </section>
    )
}