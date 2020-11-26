﻿import CEP from "core/CEP.js";
import Extension, { defaultLogger as logger } from "core/Extension.js";
import FileSystem from "core/FileSystem.js";

import CoreBase from "core/ui/core-base/core-base.js";
import "./exporter-target.less";

/** Image scalings supported by the exporter. */
const targetScalings = [
  { value: 2, label: "200%" },
  { value: 1, label: "100%" },
  { value: 0.5, label: "50%" },
  { value: 0.25, label: "25%" },
  { value: 0.125, label: "12.5%" },
];

/** Image formats supported by the exporter. */
const targetFormats = [
  { value: "tga", label: "TGA" },
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "tiff", label: "TIFF" },
  { value: "psd", label: "PSD" },
];

/** Image channels supported by the exporter. */
const targetChannels = ["Red", "Green", "Blue", "Alpha"];

/**
 * A single export target.
 */
export default CoreBase.extend({
  template: require("./exporter-target.html"),

  isolated: true,

  data: function () {
    return {
      index: -1,

      needsuffix: false,

      targetScalings: targetScalings,

      targetFormats: targetFormats,

      targetChannels: targetChannels,

      /**
       * Target data.
       * @type Object
       * @default null
       */
      model: null,
    };
  },

  computed: {
    /** Whether an error should be shown if suffix is left blank by the user. */
    showNeedsSuffixError: function () {
      return this.get("needsuffix") && String.isEmpty(this.get("model.suffix"));
    },
  },

  /**
   * Exports a single target.
   * @private
   */
  exportTarget: function () {
    return this.parent.exportTarget(this.get("index"));
  },

  /**
   * Selects local export path.
   * @private
   */
  selectLocalPath: function () {
    if (this.get("model.pathLocked")) {
      return Promise.resolve();
    } else {
      return Promise.bind(this)
        .then(function () {
          // Get document path
          return Extension.get().photoshop.getDocumentPath();
        })
        .then(function (documentPath) {
          // Get open folder parameters
          var initialPath = this.get("model.path"),
            parsedDocumentPath =
              documentPath !== null
                ? require("path").dirname(documentPath)
                : null;

          return {
            title: "Select export folder...",
            initialPath: !String.isEmpty(initialPath)
              ? initialPath
              : parsedDocumentPath,
            basePath: parsedDocumentPath,
            convertToRelative: Extension.get().settings.get("useRelativePaths"),
          };
        })
        .then(function (params) {
          // Let user select the new export path
          return FileSystem.showOpenFolderDialog(
            params.title,
            params.initialPath,
            params.basePath,
            params.convertToRelative
          );
        })
        .then(function (exportPath) {
          if (!String.isEmpty(exportPath)) {
            this.set("model.path", exportPath);
          }
        })
        .catch(function (error) {
          const msg = `Error while selecting local export path. ${error.message}`;

          if (RELEASE) {
            CEP.alert(msg);
          }

          logger.error(msg);
        });
    }
  },

  /**
   * Deletes a target.
   * @private
   */
  deleteTarget: function () {
    this.parent.splice("targets", this.get("index"), 1);
  },
});
