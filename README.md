# babble

Babble - Project Requirements:

Functionality
-	Web-based responsive chat
-	One room
-	Content open to everyone
-	User can type a new message and submit to room
-	New messages appear at the bottom
-	User can delete its own messages
-	User is defined by email address
-	Avatars should be displayed automatically for email address
-	First load should display a modal popup to collect email address
-	User can discard and continue as anonymous
-	Non-persistent (no db - all messages erased after server restart)
-	Client-side persistence:
-	Typed text in new message textarea
-	Email address / preference to be anonymous
-	Chat-room stats:
-	Number of connected users
-	Number of messages


Implementation
-	Server in NodeJS
-	Real-time updates with long polling: http://book.mixu.net/node/ch3.html
-	Automatic avatars with Gravatar: https://en.gravatar.com/site/implement/profiles/json/
-	Client-side persistence with LocalStorage: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
-	No JS libraries (e.g. jQuery, Angular, etc.)
-	No CSS frameworks (e.g. Bootstrap, etc.)
-	No IDs should be used for CSS styling
-	Exactly one JS global variable allowed: Babble
-	All class names should adhere to the SUIT CSS naming convention: https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md


Desktop Design
-	Fluid: takes full width and height regardless of screen size
-	Only scroll is in the messages area (vertical)
-	New message text area is stick to bottom
-	New message text area enlarges (grows from bottom to top) as needed to accommodate the text inside until a max of 300px and then an inner scrollbar appears
-	Message width shrink-wraps to text width with a max width of 600px
-	Focused/hovered message has a gray background and the delete button appears
-	Chat-room name is aligned left
-	Chat-room stats are aligned right
-	Anonymous user design
-	User register modal design 
- Mobile Design


HTML5 Semantics/Usability/Accessibility
-	Page/tab title should be “Vegans - Babble”
-	URL should be http://username.github.io/babble/#/vegans
-	New message should be a textarea element
-	Submit image should be a button element with an aria-label attribute
-	textarea and submit button should be inside an HTML form with relevant action which will be submitted upon button click/enter
-	Logo is an img
-	Header text is an h1
-	Logo and h1 is in a header element
-	Left area (green) is an empty nav element
-	Right area is inside a main element
-	Message list is an ordered list
-	User images should have an empty alt
-	User names should be a cite element
-	Message time should be a time element with correct datetime attribute (UNIX time)
-	Each message should be focusable with the tab key
-	Delete button for each message should be focusable with the tab key
-	Delete icon should be a button element with an aria-label attribute
-	Chat-room stats should be inside a definition list (with the terms hidden): http://devdocs.io/html/element/dl
-	Hidden content should be hidden in an accessible way:
○	http://a11yproject.com/posts/how-to-hide-content/
○	http://webaim.org/techniques/css/invisiblecontent/


Standards and Validation
-	HTML5 doctype + UTF8 charset (https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Introduction_to_HTML5)
-	Valid HTML5 (zero errors: https://validator.w3.org/)
-	Accessible (zero errors: http://wave.webaim.org/)
-	Logical heading structure (zero outline orphans: https://validator.w3.org/ (show outline))
-	No JS errors (DevTools console) (without global onerror handler)
-	Should pass all unit tests
-	80/100 or higher Google PageSpeed score (https://developers.google.com/speed/pagespeed/insights/)
-	Mobile optimized
-	Viewport meta tag present with width=device-width (https://developer.mozilla.org/en/docs/Mozilla/Mobile/Viewport_meta_tag)
-	Initial scale 100% (no automatic zoom out)
-	Don’t disable pinch zoom
-	No horizontal scroll on any screen size


Submission
-	Github username in Contacts List should be present and valid (attention: case sensitive)
-	Exact repository name: babble
-	NOTE: a code similarity checker will be used
