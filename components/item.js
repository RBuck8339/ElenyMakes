import '../colors.json' 

/* Sample attributes
    "shark-bikini-top": {
        "img_path": 'gallery/shark-bikini-top/', 
        "item_name": 'Shark Themed Bikini Top',
        "item_description": "Want your tits to look like sharks?", 
        "price": 69.67
    },
*/
export default function item({attributes}){
    // images = img for img in '../'.join(attributes.img_path));  // Something like this
    return (
        <div className="flex-col">
            
            <p className="">{attributes.item_name}</p>

        </div>
    );
}