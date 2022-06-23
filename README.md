# custom-font-awesome-icons
✨ Easily add custom icons to FontAwesome in your app, without juggling a million libraries

>> Currently tested for React apps using ```react-font-awesome```

## Why?
Ever needed an icon in FontAwesome but [can't find it](https://fontawesome.com/search)? And you end up having to use more and more icon libraries to fulfill your coooooooding needs?

Or too familiar with the FontAwesome-working style?

I had one of those problems. Probably. Or was just dead bored.

## How it works
- In the svgs folder, make subfolders of any name e.g. "brands", "regular", "my-custom-icons" etc. This will help you organize the icons
- In these subfolders, place the SVGs you wish to be added to FontAwesome. Requirements for SVGs: 1) Must be single-path SVGs. You can make them yourself using [some techniques](https://stackoverflow.com/questions/53246094/how-do-i-convert-multi-path-svg-to-one-path), or download them from sites like https://icons8.com, or you can use knockoffs of the FontAwesome Pro Icons (just sayin', not implying that you should pirate them. That would be totally unethical), 2) Name the file according to what you would want to access it with e.g. "apple-with-a-bite.svg" will become "faAppleWithABite"
- Run this script using ```node createFontAwesomeIcon.js```
- This will generate a results folder. You can copy the folders inside it, and paste them in your components folder with a name of your choice, e.g. ```components/customIcons```
- Now you can import the icons into your app! Here's an example:
```

...


import { library } from '@fortawesome/fontawesome-svg-core'

// Icons which already exist in FontAwesome
import {
  faInstagram, faTwitter, faFacebook, faLinkedin, faGoogle,
} from '@fortawesome/free-brands-svg-icons'

// Custom icons which are not available in FontAwesome, and I added through this method
import { 
faFiverr, faGmail, faGoogleForms, faUpwork,
} from "../components/customIcons/my-custom-icons";


library.add(faInstagram, faTwitter, faFacebook, faLinkedin, faGoogle, faFiverr, faGmail, faGoogleForms, faUpwork)

...
```

After the above import, I use them in the following way:
```
...
    <FontAwesomeIcon icon="fam fa-upwork" />
...
```

If your subfolder is "my-custom-icons" the prefix will be "fam".

If your subfolder is "wacky-world" the prefix will be "faw".

If your subfolder is "brands" the prefix will be "fab".


So on so forth.

You can, of course, use all the other methods to use the icons, as highlighted in the [FontAwesome Documentation](https://fontawesome.com/v5/docs/web/use-with/react).


## ToDo
- Improve the structure of the code
- Add CLI arguments for various cases
- (Try to) convert multipath SVGs into singlepath
- Figure out how to get this to work for duotone icons
- (Try to) automate the entire process of this script by turning it into a package, and then add it to "package.json" in the ```npm build``` command
