/*!
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as firestore from '@google-cloud/firestore';

import {QueryDocumentSnapshot} from './document';

export type DocumentChangeType = 'added' | 'removed' | 'modified';

/**
 * A DocumentChange represents a change to the documents matching a query.
 * It contains the document affected and the type of change that occurred.
 *
 * @class DocumentChange
 */
export class DocumentChange<T = firestore.DocumentData>
  implements firestore.DocumentChange<T>
{
  private readonly _type: DocumentChangeType;
  private readonly _document: QueryDocumentSnapshot<T>;
  private readonly _oldIndex: number;
  private readonly _newIndex: number;

  /**
   * @private
   *
   * @param {string} type 'added' | 'removed' | 'modified'.
   * @param {QueryDocumentSnapshot} document The document.
   * @param {number} oldIndex The index in the documents array prior to this
   * change.
   * @param {number} newIndex The index in the documents array after this
   * change.
   */
  constructor(
    type: DocumentChangeType,
    document: QueryDocumentSnapshot<T>,
    oldIndex: number,
    newIndex: number
  ) {
    this._type = type;
    this._document = document;
    this._oldIndex = oldIndex;
    this._newIndex = newIndex;
  }

  /**
   * The type of change ('added', 'modified', or 'removed').
   *
   * @type {string}
   * @name DocumentChange#type
   * @readonly
   *
   * @example
   * ```
   * let query = firestore.collection('col').where('foo', '==', 'bar');
   * let docsArray = [];
   *
   * let unsubscribe = query.onSnapshot(querySnapshot => {
   *   for (let change of querySnapshot.docChanges) {
   *     console.log(`Type of change is ${change.type}`);
   *   }
   * });
   *
   * // Remove this listener.
   * unsubscribe();
   * ```
   */
  get type(): DocumentChangeType {
    return this._type;
  }

  /**
   * The document affected by this change.
   *
   * @type {QueryDocumentSnapshot}
   * @name DocumentChange#doc
   * @readonly
   *
   * @example
   * ```
   * let query = firestore.collection('col').where('foo', '==', 'bar');
   *
   * let unsubscribe = query.onSnapshot(querySnapshot => {
   *   for (let change of querySnapshot.docChanges) {
   *     console.log(change.doc.data());
   *   }
   * });
   *
   * // Remove this listener.
   * unsubscribe();
   * ```
   */
  get doc(): QueryDocumentSnapshot<T> {
    return this._document;
  }

  /**
   * The index of the changed document in the result set immediately prior to
   * this DocumentChange (i.e. supposing that all prior DocumentChange objects
   * have been applied). Is -1 for 'added' events.
   *
   * @type {number}
   * @name DocumentChange#oldIndex
   * @readonly
   *
   * @example
   * ```
   * let query = firestore.collection('col').where('foo', '==', 'bar');
   * let docsArray = [];
   *
   * let unsubscribe = query.onSnapshot(querySnapshot => {
   *   for (let change of querySnapshot.docChanges) {
   *     if (change.oldIndex !== -1) {
   *       docsArray.splice(change.oldIndex, 1);
   *     }
   *     if (change.newIndex !== -1) {
   *       docsArray.splice(change.newIndex, 0, change.doc);
   *     }
   *   }
   * });
   *
   * // Remove this listener.
   * unsubscribe();
   * ```
   */
  get oldIndex(): number {
    return this._oldIndex;
  }

  /**
   * The index of the changed document in the result set immediately after
   * this DocumentChange (i.e. supposing that all prior DocumentChange
   * objects and the current DocumentChange object have been applied).
   * Is -1 for 'removed' events.
   *
   * @type {number}
   * @name DocumentChange#newIndex
   * @readonly
   *
   * @example
   * ```
   * let query = firestore.collection('col').where('foo', '==', 'bar');
   * let docsArray = [];
   *
   * let unsubscribe = query.onSnapshot(querySnapshot => {
   *   for (let change of querySnapshot.docChanges) {
   *     if (change.oldIndex !== -1) {
   *       docsArray.splice(change.oldIndex, 1);
   *     }
   *     if (change.newIndex !== -1) {
   *       docsArray.splice(change.newIndex, 0, change.doc);
   *     }
   *   }
   * });
   *
   * // Remove this listener.
   * unsubscribe();
   * ```
   */
  get newIndex(): number {
    return this._newIndex;
  }

  /**
   * Returns true if the data in this `DocumentChange` is equal to the provided
   * value.
   *
   * @param {*} other The value to compare against.
   * @return true if this `DocumentChange` is equal to the provided value.
   */
  isEqual(other: firestore.DocumentChange<T>): boolean {
    if (this === other) {
      return true;
    }

    return (
      other instanceof DocumentChange &&
      this._type === other._type &&
      this._oldIndex === other._oldIndex &&
      this._newIndex === other._newIndex &&
      this._document.isEqual(other._document)
    );
  }
}
