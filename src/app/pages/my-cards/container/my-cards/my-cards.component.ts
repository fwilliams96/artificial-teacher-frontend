import { Component, OnInit } from '@angular/core';
import { MyCardsService } from '../../services/my-cards/my-cards.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Sentence } from '../../interfaces/sentence';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss']
})
export class MyCardsComponent implements OnInit {

  sentences: Sentence[] = []

  constructor(
    private readonly _myCardsService: MyCardsService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._myCardsService.getSentences().subscribe(
      res => {
        this.sentences = res.map(sentence => {
          return {
            ...sentence,
            audioUrl: this.getURLFromBlob(this.b64toBlob(sentence.audio, 'audio/mp4')),
          }
        });

      },
      err => {
        console.log(err);
      }
    )
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  getURLFromBlob(blob: Blob): string {
    return URL.createObjectURL(blob)
  }

  b64toBlob(b64Data: string, contentType: string) {
	  const sliceSize = 512;
	  const byteCharacters = atob(b64Data);
	  const byteArrays = [];

	  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
	    for (let i = 0; i < slice.length; i++) {
	      byteNumbers[i] = slice.charCodeAt(i);
	    }

	    const byteArray = new Uint8Array(byteNumbers);
	    byteArrays.push(byteArray);
	  }

	  const blob = new Blob(byteArrays, {type: contentType});
	  return blob;
  }


}
