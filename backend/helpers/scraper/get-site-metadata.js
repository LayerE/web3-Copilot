import axios from "axios"
import { load } from 'cheerio';
const getSiteMetadata = async(q) => {
try{
    const data = await axios.get(q);
    const $ = load(data.data);
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content');
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || $('meta[name="twitter:description"]').attr('content');
    const link = q;
    return [
        {
            "title": title ?? q,
            "description": description ?? undefined,
            "link": link,
        }
    ]
}
catch(e){
console.log(e)
return [
    {
        "title": q,
        "description": undefined,
        "link": q,
    }
]
}
}


export default getSiteMetadata;