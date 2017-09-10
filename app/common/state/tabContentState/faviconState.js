/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Utils
const {isSourceAboutUrl} = require('../../../../js/lib/appUrlUtil')
const frameStateUtil = require('../../../../js/state/frameStateUtil')
const {isEntryIntersected} = require('../../../../app/renderer/lib/observerUtil')

// Styles
const {intersection} = require('../../../renderer/components/styles/global')

module.exports.showFavicon = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    console.error('Unable to find frame for showFavicon method')
    return false
  }

  const isNewTabPage = frame.get('location') === 'about:newtab'

  if (isEntryIntersected(state, 'tabs', intersection.at35)) {
    // do not show it at all at minimum ratio (intersection.at10)
    if (isEntryIntersected(state, 'tabs', intersection.at10)) {
      return false
    }

    return (
      // when almost all tab content is covered,
      // only show favicon if there's no closeIcon (intersection.at15)
      // or otherwise only for the non-active tab
      isEntryIntersected(state, 'tabs', intersection.at15) ||
      !frameStateUtil.isFrameKeyActive(state, frameKey)
    )
  }

  // new tab page is the only tab we do not show favicon
  return !isNewTabPage
}

module.exports.getFavicon = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)
  const isLoadingVisible = module.exports.showLoadingIcon(state, frameKey)

  if (frame == null) {
    console.error('Unable to find frame for getFavicon method')
    return ''
  }

  return !isLoadingVisible && frame.get('icon')
}

module.exports.showLoadingIcon = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    console.error('Unable to find frame for showLoadingIcon method')
    return false
  }

  return (
    !isSourceAboutUrl(frame.get('location')) &&
    frame.get('loading')
  )
}

module.exports.showIconWithLessMargin = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    console.error('Unable to find frame for showIconWithLessMargin method')
    return false
  }

  return isEntryIntersected(state, 'tabs', intersection.at20)
}

module.exports.showFaviconAtReducedSize = (state, frameKey) => {
  const frame = frameStateUtil.getFrameByKey(state, frameKey)

  if (frame == null) {
    console.error('Unable to find frame for showFaviconAtReducedSize method')
    return false
  }

  return isEntryIntersected(state, 'tabs', intersection.at15)
}
