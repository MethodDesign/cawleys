	document.addEventListener('DOMContentLoaded', runFunctions);

function runFunctions() {

	// VARIABLES

	const $$ = document.querySelectorAll.bind(document),
		path = window.location.pathname,
		aceArray = [],
		body = document.body,
		pageSections = $$('#page .page-section'),
		footerSections = $$('#footer-sections .page-section'),
		header = document.getElementById('header'),
		headerChildren = header.children,
		footer = document.getElementById('footer-sections'),
		scrollPosY = window.scrollY,
		caseStudyCollectionId = 'collection-620e3d4c1fadd45a416ec29e',
		newsCollectionId = 'collection-620cf3cfc199dd163bf4a6fb';
	let adminUser = false,
		fragment = document.createDocumentFragment(),
		windowWidth = window.innerWidth,
		windowHeight,
		headerHeight;
	if (document.documentElement.hasAttribute('data-authenticated-account')) adminUser = true;

	// TRIGGER FUNCTIONS ON LOAD

	navFunction(document.querySelector('.header-nav-item--external + .header-nav-item'))
	updateglobalsizesFunction()
	headerbackgroundFunction()
	acefeaturesFunction(footerSections, "Footer")
	acefeaturesFunction(pageSections, "On-Page")
	console.log('custom stuff:', aceArray);
	gallerycaptionFunction($$('.gallery-fullscreen-slideshow figcaption'))
	galleryblockFunction($$('.gallery-block'))
	summaryblockFunction($$('.summary-v2-block'))
	doublebuttonFunction($$('.button-block + .button-block'))
	formplaceholdersFunction($$('.form-block .field'))
	archiveblockFunction($$('.archive-block li'))
	customfeaturesFunction(aceArray)
	if (body.id !== newsCollectionId && body.classList.contains(newsCollectionId)) blogshareFunction()
	if (body.id === caseStudyCollectionId) casestudylistFunction($$('.blog-more-link'))
	if (body.id !== caseStudyCollectionId && body.classList.contains(caseStudyCollectionId)) casestudypostFunction()
	// quote and contact pages
	if (body.id === 'collection-6220f1ed0ded414d2a411efb' || body.id === 'collection-622226a4a80b6e4d05c1856c') formblocksplitFunction(document.querySelector('.form-block .field-list'))
	/*if (!adminUser) {
	  sidebysideFunction($$('.page-section.side-by-side'))
	}*/

	// TRIGGER FUNCTIONS ON RESIZE

	window.addEventListener('resize', debounce(function(e) {
		if (!windowWidth === window.innerWidth) {
			updateglobalsizesFunction();
			windowWidth = window.innerWidth;
		}
	}));

	// FUNCTIONS

	function updateglobalsizesFunction() {
		windowHeight = window.innerHeight;
		headerHeight = (function() {
			let childrenHeight = 0;
			for (let i = 1; i < 3; i++) {
				childrenHeight += headerChildren[i].getBoundingClientRect().height;
			}
			return childrenHeight;
		})();
		document.documentElement.style.setProperty('--window-height', windowHeight + 'px');
		document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
	} // end get window and header heights function

	function headerbackgroundFunction() {
		const firstSectionClassList = pageSections[0].classList,
			secondaryNav = header.querySelector('.secondary-nav'),
			observer = new IntersectionObserver(entries => {
				console.log(entries)
				if (entries[0].isIntersecting) header.classList.remove('scrolled')
				else header.classList.add('scrolled');
			});
		observer.observe(secondaryNav);
		if (!firstSectionClassList.contains('has-background') && (firstSectionClassList.contains('gallery-section') ? !firstSectionClassList.contains('full-bleed-section') : true)) body.classList.add('first-section-no-background')
	} // end hide header background if first section has background or is full-bleed gallery

	function navFunction(secondaryNavItem) {
		let navItems = [],
			secondaryNav = document.createElement('nav');
		fragment.appendChild(secondaryNav);
		secondaryNav.className = 'secondary-nav header-nav-list header-nav-wrapper header-layout-nav-right';
		while (secondaryNavItem) {
			navItems.push(secondaryNavItem);
			secondaryNavItem = secondaryNavItem.nextElementSibling;
		}
		navItems.map(element => secondaryNav.appendChild(element));
		header.insertBefore(secondaryNav, header.querySelector('.header-announcement-bar-wrapper'));
	} // end create secondary nav

	function checkscrollpositionFunction() {
		if (scrollPosY > 10) header.classList.add('shrink')
	} // end checkscrollposition

	function acefeaturesFunction(sections, area) {
		console.log(area);
		let previousTheme;
		sections.forEach((section, index) => {
			const nextElement = section.nextElementSibling,
				embedBlocks = section.querySelectorAll('.embed-block'),
				sectionStyles = JSON.parse(section.dataset.currentStyles),
				sectionTheme = sectionStyles.sectionTheme ? sectionStyles.sectionTheme.split('-')[0] : 'white',
				sectionBackground = section.querySelector('.section-background'),
				sectionBackgroundOverlay = sectionBackground.querySelector('.section-background-overlay'),
				sectionColour = window.getComputedStyle(section).color,
				sectionBackgroundColour = sectionBackgroundOverlay ? window.getComputedStyle(sectionBackgroundOverlay).backgroundColor : window.getComputedStyle(sectionBackground).backgroundColor;
			// styles
			section.style.setProperty('--section-colour', sectionColour);
			section.style.setProperty('--section-background-colour', sectionBackgroundColour);
			if (sectionStyles.backgroundMode === 'video') section.classList.add('has-background')
			if (sectionStyles.sectionHeight === 'section-height--custom') section.classList.add('section-height--custom')
			// theming
			section.setAttribute('data-theme', sectionTheme);
			if (sections[index - 1] && sectionTheme === previousTheme) sections[index - 1].classList.add('next-section-same-theme')
			previousTheme = sectionTheme;
			// custom features
			if (!embedBlocks) return
			embedBlocks.forEach(embedBlock => {
				const customSettings = JSON.parse('{' + embedBlock.textContent + '}'),
					features = customSettings.features.split(' ')
				customSettings.features = features;
				//console.log("james")
				console.log(customSettings.features)
				customSettings.element = embedBlock;
				aceArray.push(customSettings)
			});
		});
	} // end ace features

	function customfeaturesFunction(customFeaturesArray) {
		customFeaturesArray.forEach(itemJson => {
			const features = itemJson.features,
				embedElement = itemJson.element,
				featureSection = embedElement.closest('.page-section');
			console.log('features:', itemJson)
			features.forEach(feature => {
				if (embedElement.previousElementSibling) embedElement.previousElementSibling.classList.add(feature);
				featureSection.classList.add('has-' + feature);
				
				console.log("Switch: ", feature)
				switch (feature) {
					case 'plugin':
						pluginFunction(itemJson)
						break
					case 'grid':
						gridFunction(itemJson)
						break
					case 'slider':
						sliderFunction(itemJson)
						break
					case 'services-list':
						serviceslistFunction(itemJson)
						break
					default:
						break
				}
			});
			if (!adminUser) embedElement.remove()
		});
	}

	function pluginFunction(itemJson) {
		console.log("Plugin function:: ", itemJson)

		var pluginName = itemJson['plugin-name'],
			embedElement = itemJson.element,
			pluginElement = embedElement.previousElementSibling ? embedElement.previousElementSibling : embedElement.closest('.sqs-layout');
			
		console.log("Name: " + pluginName);
		console.log("Element: " + embedElement);
		console.log(window[pluginName].classList)

		if (!window[pluginName]) {
			pluginElement.classList.add(pluginName)
			window[pluginName] = pluginElement;
		 } else if (window[pluginName].classList.contains('sqs-layout') && !adminUser) {
			 pluginElement.parentElement.insertBefore(window[pluginName], pluginElement)
			pluginElement.remove();
		} else if (!adminUser) {
			embedElement.parentElement.insertBefore(window[pluginName], embedElement)
		}
	}

	function gridFunction(itemJson) {
		const galleryBlock = itemJson.element.previousElementSibling,
			gridColumns = itemJson['grid-columns'],
			gridGap = itemJson['grid-gap'];
		if (gridColumns) galleryBlock.style.setProperty('--grid-columns', gridColumns)
		if (gridGap) galleryBlock.style.setProperty('--grid-gap', gridGap)
	} // end custom grid using stacked gallery block

	function sliderFunction(itemJson) {
		console.log("Slider Function");
		const sliderBlock = itemJson.element.previousElementSibling,
			defaultSplideOptions = {
				type: 'slide',
				arrows: true,
				arrowPath: 'M10.222,39.488l22.702,-19.504l-22.704,-19.473c-0.798,-0.684 -2.001,-0.592 -2.685,0.206c-0.685,0.798 -0.593,2.001 0.205,2.686l19.335,16.583c0,0 -19.336,16.612 -19.336,16.612c-0.797,0.685 -0.889,1.889 -0.203,2.686c0.685,0.798 1.888,0.889 2.686,0.204Z',
				pagination: false,
				breakpoints: {
					640: {
						perPage: 1,
					}
				}
			},
			customSplideOptions = itemJson['slider-options'],
			sliderBlockClasses = sliderBlock.classList,
			sliderType = sliderBlockClasses.contains('gallery-block') ? 'gallery' :
			sliderBlockClasses.contains('summary-v2-block') ? 'summary' :
			sliderBlockClasses.contains('markdown-block') ? 'list' : undefined,
			itemsParent = sliderType === 'gallery' ? sliderBlock.querySelector('.sqs-gallery') :
			sliderType === 'summary' ? sliderBlock.querySelector('.summary-item-list') :
			sliderType === 'list' ? sliderBlock.querySelector('ul') : undefined,
			splideContainer = sliderType === 'gallery' ? sliderBlock.querySelector('.sqs-gallery-container') :
			sliderType === 'summary' ? sliderBlock.querySelector('.summary-block-wrapper') :
			sliderType === 'list' ? sliderBlock.querySelector('.sqs-block-content') : undefined,
			splideWrapper = document.createElement('div'),
			splideTrack = document.createElement('div'),
			splideList = itemsParent.cloneNode(true),
			splideSlides = [...splideList.children],
			gap = customSplideOptions && customSplideOptions.gap ? customSplideOptions.gap : sliderBlock.dataset.gutter ? sliderBlock.dataset.gutter : '20px',
			perPage = customSplideOptions && customSplideOptions.perPage ? customSplideOptions.perPage : sliderBlock.dataset.columns ? sliderBlock.dataset.columns : '3';
		sliderBlock.style.setProperty('--gap', gap)
		fragment.appendChild(splideWrapper)
		splideWrapper.appendChild(splideTrack)
		splideTrack.appendChild(splideList)
		if (customSplideOptions) splideWrapper.setAttribute('data-splide', JSON.stringify(customSplideOptions));
		else splideWrapper.setAttribute('data-splide', '{"gap":"' + gap + '","perPage":' + perPage + '}');
		splideWrapper.classList.add('splide')
		splideTrack.classList.add('splide__track')
		splideList.classList.add('splide__list')
		splideContainer.prepend(splideWrapper)
		splideSlides.forEach(splideSlide => {
			const image = splideSlide.querySelector('img');
			splideSlide.classList.add('splide__slide')
			if (image) imageloaderFunction(image, null)
		});
		const splide = new Splide(splideWrapper, defaultSplideOptions);
		splide.mount();
	} // end slider function

	function serviceslistFunction(itemJson) {
		const servicesBlock = itemJson.element.previousElementSibling,
			servicesList = servicesBlock.querySelector('ul'),
			serviceItem = servicesList.children[0];
		servicesBlock.classList.add('services-list')
		if (!servicesBlock.classList.contains('code-block')) return;
		const servicesFolder = header.querySelector('.header-nav-item--folder .header-nav-folder-title[href="/services-folder"] + .header-nav-folder-content').cloneNode(true),
			services = servicesFolder.querySelectorAll('a');
		services.forEach(service => {
			const serviceItemClone = serviceItem.cloneNode(true);
			serviceItemClone.appendChild(service)
			servicesList.appendChild(serviceItemClone)
		});
	}

	function galleryblockFunction(galleryBlocks) {
		galleryBlocks.forEach(gallery => {
			const galleryProps = JSON.parse(gallery.dataset.blockJson),
				imageWrappers = gallery.querySelectorAll('.image-wrapper, .slide');
			if (galleryProps.design === 'stacked') stackedgallerymetaFunction()
			if (galleryProps.collectionId === '6227327b1706782513443f14') timelinegalleryFunction()

			// gallery block functions

			function stackedgallerymetaFunction() {
				const metaClass = 'meta';
				imageWrappers.forEach(imageWrapper => {
					const meta = imageWrapper.nextElementSibling;
					if (meta && meta.classList.contains(metaClass)) imageWrapper.appendChild(meta)
				});
			} // end move stacked gallery item meta into image wrapper container

			function timelinegalleryFunction() {
				gallery.classList.add('timeline')
				const imageContainer = document.createElement('div');
				fragment.appendChild(imageContainer).classList.add('image-container')
				imageWrappers.forEach(imageWrapper => {
					const imageContainerClone = imageContainer.cloneNode(true),
						image = imageWrapper.querySelector('img');
					imageContainerClone.appendChild(image)
					imageWrapper.prepend(imageContainerClone)
				});
			}

		}); // end each gallery block
	} // end gallery block function

	function gallerycaptionFunction(imageCaptions) {
		imageCaptions.forEach(caption => {
			const captionWrapper = caption.querySelector('.gallery-caption-wrapper'),
				captionText = captionWrapper.querySelector('.gallery-caption-content'),
				textLines = captionText.textContent.split('\n'),
				textLinesLength = textLines.length,
				imageLink = caption.previousElementSibling.getAttribute('href');
			textLines.forEach(function(textLine, i) {
				if (i == 0) captionWrapper.innerHTML = '<h1>' + textLine + '</h1>';
				else if (i == textLinesLength - 1 && imageLink) captionWrapper.innerHTML += '<a href="' + imageLink + '" class="sqs-block-button-element sqs-button-element--primary">' + textLine + '</a>';
				else captionWrapper.innerHTML += '<p>' + textLine + '</p>';
			});
		}); // end for each caption
	} // end gallery captions

	function summaryblockFunction(blocks) {
		blocks.forEach(block => {
			let summaryProps = JSON.parse(block.dataset.blockJson),
				itemsParent = block.querySelector('.summary-item-list'),
				summaryCollectionId = summaryProps.collectionId;
			if (summaryProps.design === 'autogrid') summarygridFunction()
			const items = block.querySelectorAll('.summary-item'),
				showReadMoreLink = summaryProps.showReadMoreLink,
				readMoreText = 'Read More'
			items.forEach(item => {
				const itemLink = item.querySelector('a');
				if (showReadMoreLink) item.querySelector('.summary-read-more-link').textContent = readMoreText;
				if (!itemLink) return;
				const itemUrl = itemLink.getAttribute('href');
				if (itemUrl === path) {
					item.closest('.summary-item-list').classList.add('item-removed')
					item.remove();
				}
			});

			// summary functions

			function summarygridFunction() {
				const columsAndGutterObj = getcolumnsandgutterFunction();
				block.style.setProperty('--aspect-ratio', 100 / summaryProps.imageAspectRatio + '%')
				block.setAttribute('data-columns', columsAndGutterObj.columns)
				block.setAttribute('data-gutter', columsAndGutterObj.gutter + 'vw')
				block.style.setProperty('--columns', columsAndGutterObj.columns)
				block.style.setProperty('--gutter', columsAndGutterObj.gutter + 'vw')
			} // end summary grid function

			function getcolumnsandgutterFunction() {
				const columsAndGutterObj = {
					columns: Math.floor(summaryProps.columnWidth * 0.01),
					// gutter 0-24 = 2vw, 25-49 = 4vw, 50-74 = 6vw, 75-99 = 8vw, 100 = 10vw
					gutter: Math.ceil((summaryProps.gutter + 1) / 25) * 2
					// columns 100-199 = 1, 200-299 = 2, 300-399 = 3, 400-499 = 4 etc
				};
				return columsAndGutterObj;
			} // end get columns and gutter function

		}); // end each summary block
	} // end summary blocks function

	function doublebuttonFunction(button2s) {
		const buttonsContainer = document.createElement('div');
		fragment.appendChild(buttonsContainer)
		buttonsContainer.classList.add('buttons-container')
		button2s.forEach(button2 => {
			const buttonsContainerClone = buttonsContainer.cloneNode(true),
				button1 = button2.previousElementSibling,
				buttonsParent = button2.parentElement;
			buttonsContainerClone.appendChild(button1)
			buttonsParent.insertBefore(buttonsContainerClone, button2)
			buttonsContainerClone.appendChild(button2)
		});
	} // end double buttons

	function formplaceholdersFunction(formFields) {
		formFields.forEach(field => {
			let label,
				labelText,
				input;
			if (field.classList.contains('checkbox')) return
			if (field.classList.contains('form-item')) {
				label = field.querySelector('label');
				labelText = label.textContent.replace(/\s+/g, ' ').trim();
				input = label.nextElementSibling;
			} else {
				const fieldSet = field.closest('fieldset');
				label = field.querySelector('.caption-text');
				labelText = label.textContent.replace(/\s+/g, ' ').trim();
				if (fieldSet.classList.contains('required')) labelText += ' *'
				input = field.querySelector('input');
			}
			if (!(input instanceof HTMLSelectElement)) input.placeholder = labelText;
			else {
				const selectPlaceholder = document.createElement('option');
				selectPlaceholder.disabled = true;
				selectPlaceholder.selected = true;
				selectPlaceholder.textContent = labelText;
				input.prepend(selectPlaceholder)
			}
		});
	} // end form placeholders

	function formblocksplitFunction(fieldList) {
		const fields = Array.from(fieldList.children),
			textAreaIndex = fields.findIndex(item => item.classList.contains('textarea')),
			fieldSet1 = fields.slice(1, textAreaIndex),
			fieldSet2 = fields.slice(textAreaIndex),
			column1 = document.createElement('div');
		fragment.appendChild(column1)
		column1.classList.add('form-col')
		const column2 = column1.cloneNode(true);
		column1.append(...fieldSet1)
		column2.append(...fieldSet2)
		fieldList.appendChild(column1)
		fieldList.appendChild(column2)
	} // end split form block on quote/contact pages for side-by-side layout

	function archiveblockFunction(archiveItems) {
		archiveItems.forEach(item => {
			const link = item.querySelector('a'),
				href = link.getAttribute('href');
			if (href != path) return;
			item.classList.add('active')
			link.setAttribute('href', '/' + href.split('/')[1])
		});
	} // end if item in archive block is for current page, mark as active

	function casestudylistFunction(postLinks) {
		const linkText = 'Download PDF';
		postLinks.forEach(link => {
			link.textContent = linkText;
		});
	} // end function to change 'read more' post links to 'Download PDF'

	function casestudypostFunction() {
		const postJson = path + '?format=json';
		fetch(postJson)
			.then(r => r.json())
			.then(data => {
				console.log(data);
				const postImage = data.item.assetUrl,
					postTitle = data.item.title,
					postBannerSection = document.createElement('section'),
					sectionInner = '<div class="section-background"><img data-src="' + postImage + '"></div><div class="content-wrapper"><div class="content"><div class="sqs-layout sqs-grid-12 columns-12" data-type="page-section"><div class="row sqs-row"><div class="col sqs-col-12 span-12"><div class="sqs-block html-block sqs-block-html" data-block-type="2"><div class="sqs-block-content"><h1>' + postTitle + '</h1></div></div></div></div></div></div></div>';
				fragment.appendChild(postBannerSection)
				postBannerSection.className = 'page-section layout-engine-section background-width--full-bleed content-width--narrow horizontal-alignment--left vertical-alignment--bottom has-background dark';
				postBannerSection.innerHTML = sectionInner;
				document.getElementById('sections').prepend(postBannerSection)
				body.classList.remove('first-section-no-background')
				imageloaderFunction(postBannerSection.querySelector('.section-background img'))
			}).catch(e => console.log(e));
	} // end fetch post page json to get image and create banner section

	function blogshareFunction() {
		// const sharePos = document.querySelector('section.content-collection'),
		// 	shareDiv = document.createElement('div'),
		// 	addThisHtml = '<div class="addthis_inline_share_toolbox"></div>';
		// fragment.appendChild(shareDiv);
		// shareDiv.classList.add('blog-share-buttons')
		// shareDiv.innerHTML = '<p class="sqsrte-small">Share:</p>' + addThisHtml;
		// sharePos.appendChild(shareDiv);
	} // end blog share

	function imageloaderFunction(image, mode) {
		setTimeout(function() {
			window.ImageLoader.load(image, {
				load: true,
				mode: mode
			});
			image.classList.add('loaded')
		}, 100);
	} // end imageloader

	function debounce(func) {
		var timer;
		return function(event) {
			if (timer) clearTimeout(timer);
			timer = setTimeout(func, 500, event);
		};
	}

} // end run functions