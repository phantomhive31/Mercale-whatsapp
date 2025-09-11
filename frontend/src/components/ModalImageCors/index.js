import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Dialog, DialogContent, IconButton, Typography } from "@material-ui/core";
import { Close, ZoomIn } from "@material-ui/icons";

import ModalImage from "react-modal-image";
import api from "../../services/api";

const useStyles = makeStyles(theme => ({
	messageMedia: {
		objectFit: "cover",
		width: "100%",
		height: 200,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		cursor: "pointer",
	},

  messageMediaSticker: {
    width: 200,
    height: 200,
  },
	
	messageMediaDeleted: {
    filter: "grayscale(1)",
    opacity: 0.4
  },

  imageError: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    color: "#666",
    fontSize: "14px",
    textAlign: "center",
    padding: "20px",
  },

  modalImage: {
    maxWidth: "90vw",
    maxHeight: "90vh",
    objectFit: "contain",
  },

  modalContent: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },

  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
  },

  zoomIcon: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
  }
}));

const ModalImageCors = ({ imageUrl, isDeleted, data }) => {
	const classes = useStyles();
	const [imageError, setImageError] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [useCustomModal, setUseCustomModal] = useState(false);

	useEffect(() => {
		setImageError(false);
		setImageLoaded(false);
		setModalOpen(false);
	}, [imageUrl]);

	const handleImageError = () => {
		console.error("Erro ao carregar imagem:", imageUrl);
		setImageError(true);
	};

	const handleImageLoad = () => {
		setImageLoaded(true);
	};

	const handleImageClick = () => {
		if (imageLoaded && !imageError) {
			setModalOpen(true);
		}
	};

	const handleModalClose = () => {
		setModalOpen(false);
	};

	// Se houver erro ao carregar a imagem, mostrar fallback
	if (imageError) {
		return (
			<div className={clsx(classes.messageMedia, classes.imageError)}>
				<div>
					<p>Erro ao carregar imagem</p>
					<p style={{ fontSize: "12px", marginTop: "5px" }}>
						Clique para tentar novamente
					</p>
				</div>
			</div>
		);
	}

	// Se a imagem ainda não carregou, mostrar placeholder
	if (!imageLoaded) {
		return (
			<div 
				className={clsx(classes.messageMedia, {
					[classes.messageMediaDeleted]: isDeleted,
					[classes.messageMediaSticker]: data && ("stickerMessage" in data.message)
				})}
				style={{ 
					display: "flex", 
					alignItems: "center", 
					justifyContent: "center",
					backgroundColor: "#f5f5f5",
					color: "#666"
				}}
			>
				Carregando...
			</div>
		);
	}

	// Tenta usar react-modal-image primeiro, se falhar usa modal customizado
	try {
		return (
			<>
				<ModalImage
					className={clsx(classes.messageMedia, {
						[classes.messageMediaDeleted]: isDeleted,
						[classes.messageMediaSticker]: data && ("stickerMessage" in data.message)
					})}
					smallSrcSet={imageUrl}
					medium={imageUrl}
					large={imageUrl}
					showRotate={true}
					imageBackgroundColor="unset"
					alt="image"
					onError={handleImageError}
					onLoad={handleImageLoad}
				/>
			</>
		);
	} catch (error) {
		// Fallback para modal customizado
		return (
			<>
				<img
					className={clsx(classes.messageMedia, {
						[classes.messageMediaDeleted]: isDeleted,
						[classes.messageMediaSticker]: data && ("stickerMessage" in data.message)
					})}
					src={imageUrl}
					alt="image"
					onError={handleImageError}
					onLoad={handleImageLoad}
					onClick={handleImageClick}
				/>
				
				<Dialog
					open={modalOpen}
					onClose={handleModalClose}
					maxWidth={false}
					fullWidth
					PaperProps={{
						style: {
							backgroundColor: "transparent",
							boxShadow: "none",
						},
					}}
				>
					<DialogContent className={classes.modalContent}>
						<IconButton
							className={classes.closeButton}
							onClick={handleModalClose}
							size="small"
						>
							<Close />
						</IconButton>
						<img
							className={classes.modalImage}
							src={imageUrl}
							alt="image"
							onError={handleImageError}
						/>
					</DialogContent>
				</Dialog>
			</>
		);
	}
};

export default ModalImageCors;
