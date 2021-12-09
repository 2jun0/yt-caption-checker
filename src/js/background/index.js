import YoutubeDlWrap from '@2jun0/youtube-dl-wrap';

//Get the data from the github releases API. In this case get page 1 with a maximum of 5 items.
let githubReleasesData = await YoutubeDlWrap.getGithubReleases(1, 5);

//Download the youtube-dl binary for the given version and platform to the provided path.
//By default the latest version will be downloaded to "./youtube-dl" and platform = os.platform().
await YoutubeDlWrap.downloadFromGithub(
  'path/to/youtube-dl/binary',
  '2021.06.06',
);

//Same as above but always downloads the latest version from the youtube-dl website.
await YoutubeDlWrap.downloadFromWebsite('path/to/youtube-dl/binary', 'win32');

//Init an instance with a given binary path.
//If none is provided "youtube-dl" will be used as command.
const youtubeDlWrap = new YoutubeDlWrap('path/to/youtube-dl/binary');
//The binary path can also be changed later on.
youtubeDlWrap.setBinaryPath('path/to/another/youtube-dl/binary');

chrome.runtime.onMessage.addListener(({ type, value }, sender, sendRes) => {
  if (type === 'has-subtitles') {
    value;
  }
});
