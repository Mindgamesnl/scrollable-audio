import WebAudio from "./lib/WebAudio";

class SectionSounds {

    constructor() {
        this._bootTime = new Date();
        // STRING url / Media
        this._media = {};
        // list of elements
        this._elements = [];

        window.onscroll = () => {
            this.update();
        }
    }

    update() {
        let updatedSources = [];

        for (let elementsKey in this._elements) {
            if (this._isInViewport(this._elements[elementsKey])) {
                updatedSources.push(this._elements[elementsKey].dataset.saudio);
            }
        }

        // remove old sounds
        for (let source in this._media) {
            if (!updatedSources.includes(source)) {
                this._media[source].setVolume(0, 250, () => {
                    delete this._media[source];
                });
            }
        }

        // start new sounds
        updatedSources.forEach((source => {
            if (this._media[source] == null) {
                let audio =  new WebAudio(source, () => {
                    audio.setLooping(true);
                    audio.play();
                    audio.startDate();
                    audio.setVolume(0);
                    audio.setVolume(100, 250);
                }, this._bootTime);

                this._media[source] = audio;
            }
        }));
    }

    registerElement(element, source) {
        element.dataset.saudio = source;
        this._elements.push(element);
    }

    _isInViewport(elem) {
        let bounding = elem.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

}

window.SectionSounds = SectionSounds;
