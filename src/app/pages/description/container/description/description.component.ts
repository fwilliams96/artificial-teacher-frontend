import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DescriptionService } from '../../services/description.service';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoToastService } from 'src/app/shared/modules/toast/services/info-toast/info-toast.service';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { Description } from '../../interfaces/description';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DescriptionSolution, DescriptionSolutionType } from '../../interfaces/description-solution';
import { faMicrophone, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AudioRecorderService } from 'src/app/shared/modules/audio-recorder/services/audio-recorder.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  
  faMicrophone = faMicrophone
  faTrash = faTrash
  faPaperPlane = faPaperPlane
  
  idDescription: string | null = null;
  description: Description | undefined = undefined;
  recordButtonLabel = 'Grabar audio';
  showMobile = false;

  blobUrl: string | undefined = undefined;
  blobAudio: Blob | undefined = undefined;
  isRecording = false;
  recordedTime: any;

  descriptionText = '';

  descriptionForm = this.fb.group({
    userDescription: ['', Validators.required]
  });

  constructor(
    private readonly _descriptionService: DescriptionService,
    private _audioRecorderService: AudioRecorderService,
    private domSanitizer: DomSanitizer,
    private readonly _infoToastService: InfoToastService,
    private readonly _dangerToastService: DangerToastService,
    private _router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const determineMobile = (e: any) => {
      if (e.matches) {
        this.showMobile = true;
      } else {
        this.showMobile = false;
      }
    }

    const laptopScreen = window.matchMedia('(max-width: 990px)');
    determineMobile(laptopScreen);

    laptopScreen.addEventListener('change', determineMobile);

    this.recoverDescription();

    this._audioRecorderService.recordingFailed().subscribe(() => {
      console.log("Recording failed");
      this.isRecording = false;
      this.stopRecording();
    });

    this._audioRecorderService.getRecordedTime().subscribe((time) => {
      // console.log(`Recorded time: ${time}`);
      this.recordedTime = time;
    });

    this._audioRecorderService.getRecordedBlob().subscribe((data) => {
      // console.log(`Recorded blob: ${data}`);
      this.blobAudio = data.blob;
      this.blobUrl = URL.createObjectURL(data.blob);
    });

  }

  recoverDescription() {
    this.idDescription = this.route.snapshot.paramMap.get('id');
    if (!this.idDescription) return;

    this._descriptionService.getDescription(this.idDescription).subscribe(
      description => {
        this.description = description;
        this.description.image_url = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+this.description.image);
        if (description.finished) {
          if (this.description.user_solution) {
            if (this.description.user_solution.type == DescriptionSolutionType.TEXT) {
              this.descriptionText = this.description.user_solution.content;
            }
            if (this.description.user_solution.type == DescriptionSolutionType.SPEECH) {
              this.blobUrl = URL.createObjectURL(this.b64toBlob(this.description.user_solution.content as string, 'audio/mp3'));
            }
          }
        }
      },
      err => {
        this._dangerToastService.show('Ha habido un error al recuperar la descripción');
        console.log(err);
      }
    )
  }

  startRecording() {
    console.log("Start recording");
    this.deleteRecording();

    this._audioRecorderService.startRecording();
  }

  stopRecording() {
    console.log("Stop recording");
    this._audioRecorderService.stopRecording();
  }

  deleteRecording() {
    this.blobAudio = undefined;
    this.blobUrl = undefined;
  }

  sendDescriptionText() {
    if (!this.idDescription) return;

    const userSolution: DescriptionSolution = {
      content: this.descriptionText,
      type: DescriptionSolutionType.TEXT
    };

    this._descriptionService.deliverDescription(this.idDescription, userSolution).subscribe(
      description => {
        this.description = description;
        if (description.finished) {
          if (this.description.user_solution) {
            this.descriptionText = this.description.user_solution.content;
          }
        }
      },
      err => {
        this._dangerToastService.show('Ha habido un error al enviar la descripción');
        console.log(err);
      }
    )
  }

  sendDescriptionAudio() {
    if (!this.idDescription) return;

    if (!this.blobAudio) return;

    this.blobToBase64(this.blobAudio).then(base64Audio => {
      const userSolution: DescriptionSolution = {
        content: base64Audio,
        type: DescriptionSolutionType.SPEECH
      };
  
      this._descriptionService.deliverDescription(this.idDescription!, userSolution).subscribe(
        description => {
          this.description = description;
          if (description.finished) {
            if (this.description.user_solution) {
              this.blobUrl = URL.createObjectURL(this.b64toBlob(this.description.user_solution.content as string, 'audio/mp3'));
            }
          }
        },
        err => {
          this._dangerToastService.show('Ha habido un error al enviar la descripción');
          console.log(err);
        }
      )
    });
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

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = this.arrayBufferToBase64(reader.result as ArrayBuffer);
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    // console.log(`Array buffer: ${JSON.stringify(buffer)}`)
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this.startRecording();
      this.recordButtonLabel = 'Parar audio';
    }
    else {
      this.stopRecording();
      this.recordButtonLabel = 'Grabar audio';
    }
  }

  goBack() {
    this._router.navigate(['/home']);
  }

}
