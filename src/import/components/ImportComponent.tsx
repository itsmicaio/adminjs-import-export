import React, { FC, useState } from 'react';
import { ActionProps, ApiClient, useNotice } from 'admin-bro';
import { Loader, Box, Button, DropZone } from '@admin-bro/design-system';

const ImportComponent: FC<ActionProps> = ({ resource }) => {
  const [file, setFile] = useState<null | File>(null);
  const sendNotice = useNotice();
  const [isFetching, setFetching] = useState<boolean>();

  const onUpload = (uploadedFile: File[]) => {
    setFile(uploadedFile?.[0] ?? null);
  };

  const onSubmit = async () => {
    if (!file) {
      return;
    }

    setFetching(true);
    try {
      const importData = new FormData();
      importData.append('file', file, file?.name);
      await new ApiClient().resourceAction({
        method: 'post',
        resourceId: resource.id,
        actionName: 'import',
        data: importData,
      });

      sendNotice({ message: 'Imported successfully', type: 'success' });
    } catch (e) {
      sendNotice({ message: e.message, type: 'error' });
    }
    setFetching(false);
  };

  return (
    <Box>
      <DropZone files={[]} onChange={onUpload} multiple={false} />
      <Button onClick={onSubmit} disabled={!file || isFetching}>
        {isFetching && <Loader />} Upload
      </Button>
    </Box>
  );
};

export default ImportComponent;