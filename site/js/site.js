var currentPageTitle; //current page label

window.addEventListener('load', (event) =>
{
    currentPageTitle = document.getElementById('tab_name').innerHTML.toString();
    console.log("Page Title: " + currentPageTitle);
});

/**
 * 
 * @param {*} item Subdirectory to browse to
 */
function goToPage(item)
{
    var nextPage = window.location.href.substring(0, window.location.href.indexOf(currentPageTitle));

    switch(item)
    {
        case "home":
        {
            nextPage += "index.html";
            break;   
        }

        case "about":
        {
            nextPage += "sections/about/index.html";
            break;
        }

        case "people":
        {
            nextPage += "sections/people/index.html";
            break;
        }

        case "blog":
        {
            nextPage += "sections/blog/index.html";
            break;
        }

        case "products":
        {
            nextPage += "sections/products/index.html";
            break;
        }

        case "register_login":
        {
            nextPage += "sections/register_login/index.html";
            break;
        }

        case "contact":
        {
            nextPage += "sections/contact/index.html";
            break;   
        }

        default:
        {
            //404biatch
            break;
        }
    }
    open(nextPage, "_self", "", false);
}