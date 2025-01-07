const attachmentModel = require("../../models/message/attachment.model");
const { getFileType } = require('../../utils/file.util');
const fs = require('fs');
const path = require("path");

class AttachmentService {
    async GetAttactmentContent(filePath) {
        const fileType = getFileType(filePath);
        if (fileType === 'code') {
            const content = fs.readFileSync(path.join(__dirname, '../../../' + filePath), 'utf-8');
            console.log(content);
            return content;
        }
        return null;
    }
}

module.exports = new AttachmentService();