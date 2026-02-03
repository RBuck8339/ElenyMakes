ITEMS = {
    "shark-bikini-top": {
        "img_path": 'gallery/shark-bikini-top/',  // Group multiple images, we can do like a basic off the model to start and have the second image be on a model or something
        "item_name": 'Shark Themed Bikini Top',
        "item_description": "Want your tits to look like sharks?",  // Non-negotiable description
        "price": 69.67
        },
    "shark-bikini-bottom": {

        },
    "shark-bikini-combo": {
        "img_path":  'gallery/NULL/'  // Need to discuss with Eleny how we do pictures
        },
    "brown bikini top": {

        },
    "brown-bikini-bottom": {

        },
    "brown-bikini-combo": {

        }, 
    "wave-top": {
        
    }

}

export default function home(){
    // If "-combo" in item, group -bottom && -top images (two ways to do this, replace -combo or have a folder with duplicates (depends if you want to have both in the same image))
    
    // Layering scheme
    /*
        Outer is entire homepage
        Next is header including navigation and cart and such
        Then items
        Then about section if desired
    */
    return (
        
        <div className="">  

        </div>
    )
}