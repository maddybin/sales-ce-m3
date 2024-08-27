(function ($) {
  $(document).ready(function () {
    console.log('loaded')
  });
})(jQuery);

function nameCleaning(nameString: string, noHtml = true) {
  // Removed things between () on last_name
  nameString = nameString.replace(/\(([^)]+)\)/, "")

  // Remove Special Char's from final string.
  nameString = nameString.replace(/[^\p{Letter}\p{Mark}]+/gu, ' ').trim();

  // Remove Certification Acronyms

  if (noHtml) {
    // 1. Remove text whitespace.
    nameString = nameString.split(' ')[0];
  }

  // 2. Remove text after ,
  nameString = nameString.split(',')[0];

  return nameString;
}

function decodeAmpTwice(data = "") {
  return (data || "").replace(/&amp;/g, '&');
};

function sanitizeLIUrl(url: string) {
  if (url) {
    var split_token = 'linkedin.com';
    var li_slug = url.split(split_token)[1];
    if (li_slug) {
      url = 'https://www.' + split_token + li_slug;
      return url;
    } else {
      return url;
    }
  } else {
    return null;
  }
};

function formatUrl(url: string, delimiter: any) {
  if (url) {
    if (url.includes('linkedin.com')) {
      url = url.split(delimiter)[0];
    } else {
      url = 'https://www.linkedin.com' + url.split(delimiter)[0];
    }
  }
  return url;
};

function extractMemberIdentity(url: any, key: any) {
  if (url.split(key).length && url.split(key)[1] && url.split(key)[1].split('/').length) {
    if (url.split(key)[1].split('/')[0] === 'unavailable') {
      return null;
    } else {
      return url.split(key)[1].split('/')[0];
    }
  } else {
    return null;
  }
}

function decodeAmp(data = "") {
  if (data && data.length === 1 && data[0] == "") {
    data = "";
  }
  return decodeAmpTwice((data || "").replace(/&amp;/g, '&'));
};

function isBasicLiContactProfilePage() {
  return document.getElementsByClassName('profile-background-image').length;
}

function isBasicLiCompanyProfilePage() {
  return document.getElementsByClassName('organization-outlet').length;
}

function isBasicLiContactSearchPage() {
  return window.location.href.includes('https://www.linkedin.com/search/results/people/');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.title) {
    case 'fetchParseHtml':
      if (isBasicLiContactProfilePage()) {  
        const profile = { basic_info: [{}] as any };

        let topNode = $('.top-card-background-hero-image');
        let topSiblings = topNode ? topNode.siblings()[0] : null;
        let topChild = topSiblings ? topSiblings.children[1] : null;
        let infoContainer = topChild ? topChild.children[0] : null;

        if (infoContainer) {
          profile.basic_info[0].headline = nameCleaning(infoContainer.children[1].textContent as any, false);
        }

        const profileName = nameCleaning(decodeAmp($('.pv-top-card-profile-picture__image--show').attr('alt')), false);

        if (profileName.length) {
          profile.basic_info[0].name = profileName;
        } else {
          profile.basic_info[0].name = nameCleaning(decodeAmp($('.profile-photo-edit__preview').attr('alt')), false);
        }

        let profileImage = $('.pv-top-card-profile-picture__image--show').attr('src');
        if (profileImage) {
          profile.basic_info[0].image_url = profileImage;
        } else {
          profile.basic_info[0].image_url = $('.profile-photo-edit__preview').attr('src');
        }

        if (profile.basic_info[0].image_url === undefined || profile.basic_info[0].image_url.includes('data:image')) {
          profile.basic_info[0].image_url = `images/default_contact_image.png`;
        }

        let windowUrl = sanitizeLIUrl(formatUrl(location.href, '?'));
        if (extractMemberIdentity(windowUrl, '/in/')) {
          profile['linkedin_url'] = `https://www.linkedin.com/in/${extractMemberIdentity(windowUrl, '/in/')}`
        }
        console.log(profile)
        sendResponse({ data: [profile], type: 'basic_contact_profile' });
        return true;
        break;
      } else if (isBasicLiCompanyProfilePage()) {
        let profile = { default: [{}] as any };
        let profileInfoSection = document.getElementsByClassName('org-top-card__primary-content')[0];
        let logo = profileInfoSection.getElementsByTagName('img')[0] ? profileInfoSection.getElementsByTagName('img')[0].getAttribute('src') : null;

        profile.default[0].logo_url = logo;
        profile.default[0].name = profileInfoSection.getElementsByTagName('h1')[0].textContent?.trim();
        profile.default[0].industry = profileInfoSection.getElementsByClassName('org-top-card-summary-info-list__info-item')[0].textContent?.trim();
        profile.default[0].linkedin_url = document.location.href;

        let isValid = profile.default[0]['name'] && profile.default[0].linkedin_url;
        if (isValid) {
          sendResponse({ data: [profile], type: 'basic_company_profile' });
        } else {
          sendResponse({ data: [], type: 'error_page' });
        }

        return true;
      } else if (isBasicLiContactSearchPage()) {
        let allButtons = document.getElementsByClassName('search-reusables__filter-pill-button');
        for (let i = 0; i < allButtons.length; i++) {
          if (document.getElementsByClassName('search-reusables__filter-pill-button')[i].getAttribute('aria-label') === 'People') {
            var searchTags = document.getElementsByClassName('search-results-container')[0].getElementsByTagName('ul')[0].getElementsByTagName('li');
            let peopleLists: any = [];
            for (let i = 0; i < searchTags.length; i++) {
              let profile: any = { basic_info: [{}] };
              let resultSectionTag: any = searchTags[i].getElementsByClassName('entity-result__content')[0];
              profile.basic_info[0]['name'] = resultSectionTag.getElementsByClassName('entity-result__title-text')[0].getElementsByClassName('app-aware-link')[0].getElementsByTagName('span')[0].getElementsByTagName('span')[0]?.textContent.trim() || '';
              profile.basic_info[0]['headline'] = resultSectionTag.getElementsByClassName('entity-result__primary-subtitle')[0]?.textContent.trim() || '';
              profile.basic_info[0]['location'] = resultSectionTag.getElementsByClassName('entity-result__secondary-subtitle')[0]?.textContent.trim() || '';
              profile.basic_info[0]['image_url'] = searchTags[i].getElementsByClassName('entity-result__image')[0].getElementsByTagName('img')[0]?.getAttribute('src');
              profile['token'] = localStorage.getItem('token');
              let liUrl = resultSectionTag.getElementsByClassName('entity-result__title-text')[0].getElementsByClassName('app-aware-link')[0]?.getAttribute('href') || null;
              profile['linkedin_url'] = liUrl ? liUrl.split('?')[0] : null;
              peopleLists.push(profile);
            }
            sendResponse({ data: peopleLists, type: 'result_page' });
            return true;
          }
        }
      } else {
        sendResponse({ data: [], type: 'error_page' });
        return true;
      }
  }
  return true;
});
